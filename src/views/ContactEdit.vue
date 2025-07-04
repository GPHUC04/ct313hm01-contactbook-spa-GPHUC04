<!-- <script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ContactForm from '@/components/ContactForm.vue';
import makeContactsService from '@/services/contacts.service';
import { DEFAULT_AVATAR } from '@/constants';

const props = defineProps({
  contactId: { type: String, required: true },
});

const router = useRouter();
const route = useRoute();
const contact = ref(null);
const message = ref('');
const isLoading = ref(true);

const initialContact = {
  name: '',
  email: '',
  address: '',
  phone: '',
  favorite: false,
  avatar: DEFAULT_AVATAR,
};

const contactsService = makeContactsService();

async function getContact(id) {
  try {
    isLoading.value = true;
    console.log('Fetching contact with ID:', id);
    const response = await contactsService.fetchContact(id);
    console.log('Raw response from fetchContact:', response);

    if (!response || typeof response !== 'object') {
      throw new Error('Invalid or empty response from API');
    }

    contact.value = {
      id: id,
      ...response,
      avatar: response.avatar || DEFAULT_AVATAR,
    };
    if (!contact.value.id) {
      throw new Error('No contact found for the given ID');
    }
  } catch (error) {
    console.error('Error fetching contact:', error.message, error.response?.data);
    message.value = 'Không tìm thấy liên hệ hoặc có lỗi xảy ra.';
    router.push({
      name: 'notfound',
      params: { pathMatch: route.path.split('/').slice(1) },
      query: route.query,
      hash: route.hash,
    });
  } finally {
    isLoading.value = false;
  }
}

async function onUpdateContact(contactData) {
  try {
    isLoading.value = true;
    console.log('Updating contact with data:', contactData); // Debug log
    await contactsService.updateContact(props.contactId, contactData);
    message.value = 'Liên hệ được cập nhật thành công.';
    setTimeout(() => {
      router.push({ name: 'contactbook' });
    }, 2000);
  } catch (error) {
    console.error('Error updating contact:', error);
    message.value = 'Có lỗi xảy ra khi cập nhật liên hệ.';
  } finally {
    isLoading.value = false;
  }
}

async function onDeleteContact(id) {
  if (confirm('Bạn muốn xóa Liên hệ này?')) {
    try {
      isLoading.value = true;
      console.log('Deleting contact with ID:', id);
      const response = await contactsService.deleteContact(id); // Lưu response để kiểm tra
      console.log('Delete response:', response);

      // Nếu xóa thành công (dựa trên việc dữ liệu bị xóa), bỏ qua lỗi 500
      message.value = 'Liên hệ đã được xóa.';
      router.push({ name: 'contactbook' });
    } catch (error) {
      console.error('Error deleting contact:', error.message, error.response?.data);
      // Chỉ hiển thị lỗi nếu không phải là trường hợp xóa thành công nhưng trả về 500
      if (error.response?.status === 500 && !error.response?.data?.message) {
        message.value = 'Liên hệ đã được xóa, nhưng có lỗi từ máy chủ.';
      } else {
        message.value = 'Có lỗi xảy ra khi xóa liên hệ.';
      }
      router.push({ name: 'contactbook' }); // Chuyển hướng dù có lỗi
    } finally {
      isLoading.value = false;
    }
  }
}

onMounted(() => {
  if (!/^\d+$/.test(props.contactId)) {
    message.value = 'ID liên hệ không hợp lệ.';
    router.push({ name: 'notfound' });
    return;
  }
  getContact(props.contactId);
});
</script>

<template>
  <div class="page" v-if="!isLoading">
    <h4 v-if="contact">Hiệu chỉnh Liên hệ</h4>
    <p v-if="!contact && !isLoading" class="alert alert-warning">Liên hệ không tồn tại.</p>
    <ContactForm
      v-if="contact"
      :contact="contact"
      :is-add-mode="false"
      @save:contact="onUpdateContact"
      @delete:contact="onDeleteContact"
      @cancel:contact="() => router.push({ name: 'contactbook' })"
    />
    <p v-if="message" class="alert alert-info mt-3">{{ message }}</p>
  </div>
  <div v-else class="text-center">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Đang tải...</span>
    </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.alert {
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
}

.alert-info {
  background-color: #d1ecf1;
  border-color: #bee5eb;
  color: #0c5460;
}

.alert-warning {
  background-color: #fff3cd;
  border-color: #ffeeba;
  color: #856404;
}
</style> -->

<script setup>
import { ref, onMounted } from 'vue';
import { useQuery, useMutation } from '@tanstack/vue-query';
import { useRouter, useRoute } from 'vue-router';
import ContactForm from '@/components/ContactForm.vue';
import makeContactsService from '@/services/contacts.service';
import { DEFAULT_AVATAR } from '@/constants';

const props = defineProps({
  contactId: { type: String, required: true },
});

const router = useRouter();
const route = useRoute();
const message = ref('');

const queryKey = ['contact', props.contactId];

const {
  data: contact,
  isLoading,
  error,
} = useQuery({
  queryKey,
  queryFn: () => makeContactsService().fetchContact(props.contactId),
  enabled: !!props.contactId,
});

const deleteMutation = useMutation({
  mutationFn: (id) => makeContactsService().deleteContact(id),
  onSuccess: () => {
    message.value = 'Liên hệ đã được xóa.';
    router.push({ name: 'contactbook' });
  },
  onError: (error) => {
    message.value = 'Có lỗi xảy ra khi xóa liên hệ.';
    console.error('Delete error:', error);
  },
});

const updateMutation = useMutation({
  mutationFn: (contactData) => makeContactsService().updateContact(props.contactId, contactData),
  onSuccess: () => {
    message.value = 'Liên hệ được cập nhật thành công.';
    setTimeout(() => router.push({ name: 'contactbook' }), 2000);
  },
  onError: (error) => {
    message.value = 'Có lỗi xảy ra khi cập nhật liên hệ.';
    console.error('Update error:', error);
  },
});

function onDeleteContact(id) {
  if (confirm('Bạn muốn xóa Liên hệ này?')) {
    deleteMutation.mutate(id);
  }
}

function onUpdateContact(contactData) {
  updateMutation.mutate(contactData);
}

onMounted(() => {
  if (!/^\d+$/.test(props.contactId)) {
    message.value = 'ID liên hệ không hợp lệ.';
    router.push({ name: 'notfound' });
  }
});
</script>

<template>
  <div class="page" v-if="!isLoading">
    <h4 v-if="contact">Hiệu chỉnh Liên hệ</h4>
    <p v-if="error" class="alert alert-warning">{{ error.message || 'Liên hệ không tồn tại.' }}</p>
    <ContactForm
      v-if="contact"
      :contact="contact"
      :is-add-mode="false"
      @save:contact="onUpdateContact"
      @delete:contact="onDeleteContact"
      @cancel:contact="() => router.push({ name: 'contactbook' })"
    />
    <p v-if="message" class="alert alert-info mt-3">{{ message }}</p>
  </div>
  <div v-else class="text-center">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Đang tải...</span>
    </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.alert {
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
}

.alert-info {
  background-color: #d1ecf1;
  border-color: #bee5eb;
  color: #0c5460;
}

.alert-warning {
  background-color: #fff3cd;
  border-color: #ffeeba;
  color: #856404;
}
</style>
