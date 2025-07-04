import { DEFAULT_AVATAR } from '@/constants';
import axios from 'axios';

/**
 * Hàm gọi API với axios
 * @param {string} url
 * @param {Object} config - Cấu hình axios (method, headers, body, v.v.)
 * @returns Promise<Object>
 */

async function efetch(url, config = {}) {
  try {
    const response = await axios({
      url,
      ...config,
    });
    console.log('Axios response:', response.status, response.data);
    if (response.status < 200 || response.status >= 300) {
      throw new Error(
        `Request failed with status ${response.status}: ${response.data.message || 'No detail'}`,
      );
    }
    return response.data.data;
  } catch (error) {
    console.error('Axios error:', error.message, error.response?.data);
    throw error; // Truyền lỗi chi tiết
  }
}

function makeContactsService() {
  const baseUrl = '/api/v1/contacts';

  async function fetchContacts(page, limit = 10) {
    const url = `${baseUrl}?page=${page}&limit=${limit}`;
    console.log('Fetching URL:', url);
    const data = await efetch(url);
    if (!data || !data.contact || !Array.isArray(data.contact)) {
      console.warn('Không có dữ liệu contact, trả về phản hồi rỗng');
      return { contact: [], metadata: { lastPage: 1 } };
    }
    const contactsWithAvatar = data.contact.map((contact) => ({
      ...contact,
      avatar: contact.avatar || DEFAULT_AVATAR,
    }));
    return {
      contact: contactsWithAvatar,
      metadata: data.metadata || { lastPage: 1 },
    };
  }

  async function searchContacts(page, limit = 10, searchTerm) {
    if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.trim() === '') {
      console.warn('Invalid search term, returning empty response');
      return { contact: [], metadata: { lastPage: 1 } };
    }
    const url = `${baseUrl}/search?page=${page}&limit=${limit}&q=${encodeURIComponent(searchTerm.trim())}`;
    console.log('Searching URL:', url);
    const data = await efetch(url);
    if (!data || !data.contact || !Array.isArray(data.contact)) {
      console.warn('No search data, returning empty response');
      return { contact: [], metadata: { lastPage: 1 } };
    }
    const contactsWithAvatar = data.contact.map((contact) => ({
      ...contact,
      avatar: contact.avatar || DEFAULT_AVATAR,
    }));
    return {
      contact: contactsWithAvatar,
      metadata: data.metadata || { lastPage: 1 },
    };
  }

  async function fetchContact(id) {
    const data = await efetch(`${baseUrl}/${id}`);
    return {
      ...data.contact,
      avatar: data.contact.avatar ?? DEFAULT_AVATAR,
    };
  }

  async function createContact(contact) {
    console.log('Creating contact with data:', contact); // Log dữ liệu gửi đi
    return efetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data', // Sử dụng multipart cho FormData
      },
      data: contact, // Gửi trực tiếp FormData
    });
  }

  async function updateContact(id, contact) {
    return efetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'multipart/form-data', // Sử dụng multipart cho FormData
      },
      data: contact,
    });
  }

  async function deleteContact(id) {
    const url = `${baseUrl}/${id}`;
    console.log('Delete URL:', url);
    try {
      const response = await efetch(url, {
        method: 'DELETE',
      });
      console.log('Delete response from efetch:', response);
      return response;
    } catch (error) {
      console.error('Delete error:', error.message, error.response?.data);
      throw error; // Truyền lỗi để xử lý ở cấp cao hơn
    }
  }

  async function deleteAllContacts() {
    return efetch(baseUrl, {
      method: 'DELETE',
    });
  }

  return {
    fetchContacts,
    searchContacts,
    fetchContact,
    createContact,
    updateContact,
    deleteContact,
    deleteAllContacts,
  };
}

export default makeContactsService;
