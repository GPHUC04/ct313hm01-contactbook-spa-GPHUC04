<!-- <script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ContactCard from '@/components/ContactCard.vue';
import InputSearch from '@/components/InputSearch.vue';
import ContactList from '@/components/ContactList.vue';
import MainPagination from '@/components/MainPagination.vue';
import makeContactsService from '@/services/contacts.service';
const contactsService = makeContactsService();

const router = useRouter();
const route = useRoute();
const totalPages = ref(1);
const currentPage = ref(1); // Thay computed bằng ref để có thể thay đổi khi tìm kiếm
const contacts = ref([]);
const selectedIndex = ref(-1);
const searchText = ref('');

const searchableContacts = computed(() =>
  contacts.value.map((contact) => {
    const { name, email, address, phone } = contact;
    return [name, email, address, phone].join('').toLowerCase();
  }),
);

const filteredContacts = computed(() => {
  if (!searchText.value) return contacts.value;
  const searchTerm = searchText.value.toLowerCase();
  return contacts.value.filter((contact, index) =>
    searchableContacts.value[index].includes(searchTerm),
  );
});
const selectedContact = computed(() => {
  if (selectedIndex.value < 0) return null;
  return filteredContacts.value[selectedIndex.value];
});

async function retrieveContacts(page) {
  try {
    const chunk = await contactsService.fetchContacts(page, 10);
    totalPages.value = chunk.metadata?.lastPage ?? 1;
    contacts.value = Array.isArray(chunk.contact)
      ? chunk.contact.sort((current, next) => current.name.localeCompare(next.name))
      : [];
    selectedIndex.value = -1;
  } catch (error) {
    console.log('Error retrieving contacts:', error);
    contacts.value = [];
    totalPages.value = 1;
    selectedIndex.value = -1;
  }
}

async function searchContacts(page, searchTerm) {
  try {
    const chunk = await contactsService.searchContacts(page, 10, searchTerm);
    totalPages.value = chunk.metadata?.lastPage ?? 1;
    contacts.value = Array.isArray(chunk.contact)
      ? chunk.contact.sort((current, next) => current.name.localeCompare(next.name))
      : [];
    selectedIndex.value = -1;
    currentPage.value = page; // Cập nhật trang hiện tại
  } catch (error) {
    console.log('Error searching contacts:', error);
    contacts.value = [];
    totalPages.value = 1;
    selectedIndex.value = -1;
  }
}

async function onDeleteContacts() {
  if (confirm('Bạn có muốn xóa tất cả Liên hệ')) {
    try {
      await contactsService.deleteAllContacts();
      totalPages.value = 1;
      contacts.value = [];
      selectedIndex.value = -1;
      changeCurrentPage(1);
    } catch (error) {
      console.log(error);
    }
  }
}
function goToAddContact() {
  router.push({ name: 'contact.add' });
}
function changeCurrentPage(page) {
  if (searchText.value) {
    searchContacts(page, searchText.value); // Gọi tìm kiếm nếu có từ khóa
  } else {
    retrieveContacts(page); // Gọi lấy toàn bộ nếu không có từ khóa
  }
  router.push({ name: 'contactbook', query: { page } });
}

watch(searchText, (newValue) => {
  console.log('Search text updated:', newValue);
  selectedIndex.value = -1;
  if (newValue) {
    searchContacts(1, newValue); // Tìm kiếm ngay khi nhập, bắt đầu từ trang 1
  } else {
    retrieveContacts(1); // Lấy lại toàn bộ khi xóa từ khóa
  }
});
watch(
  () => route.query.page,
  (newPage) => {
    const page = Number(newPage) || 1;
    if (searchText.value) {
      searchContacts(page, searchText.value);
    } else {
      retrieveContacts(page);
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="page row mb-5">
    <div class="mt-3 col-md-6">
      <h4>
        Danh bạ
        <i class="fas fa-address-book"></i>
      </h4>
      <div class="my-3">
        <InputSearch v-model="searchText" @search="searchContacts(1, $event)" />
      </div>
      <ContactList
        v-if="filteredContacts.length > 0"
        :contacts="filteredContacts"
        v-model:selected-index="selectedIndex"
      />
      <p v-else>Không có liên hệ nào hiển thị hoặc không tìm thấy kết quả.</p>
      <div class="mt-3">
        <MainPagination
          :total-pages="totalPages"
          :current-page="currentPage"
          @update:current-page="changeCurrentPage"
        />
        <div class="mt-2 d-flex flex-wrap justify-content-between align-items-center">
          <button class="btn btn-sm btn-primary" @click="retrieveContacts(currentPage)">
            <i class="fas fa-redo"></i> Làm mới
          </button>
          <button class="btn btn-sm btn-success" @click="goToAddContact">
            <i class="fas fa-plus"></i> Thêm mới
          </button>
          <button class="btn btn-sm btn-danger" @click="onDeleteContacts">
            <i class="fas fa-trash"></i> Xóa tất cả
          </button>
        </div>
      </div>
    </div>
    <div class="mt-3 col-md-6">
      <div v-if="selectedContact">
        <h4>
          Chi tiết Liên hệ
          <i class="fas fa-address-card"></i>
        </h4>
        <ContactCard :contact="selectedContact" />
      </div>
      <div v-else>
        <p>Chọn một liên hệ để xem chi tiết.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  text-align: left;
  max-width: 750px;
  margin: 0 auto;
}
</style> -->
<!-- 
<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ContactCard from '@/components/ContactCard.vue';
import InputSearch from '@/components/InputSearch.vue';
import ContactList from '@/components/ContactList.vue';
import MainPagination from '@/components/MainPagination.vue';
import makeContactsService from '@/services/contacts.service';

const contactsService = makeContactsService();
const router = useRouter();
const route = useRoute();
const totalPages = ref(1);
const currentPage = ref(1);
const contacts = ref([]);
const selectedIndex = ref(-1);
const searchText = ref('');

const searchableContacts = computed(() =>
  contacts.value.map((contact) => {
    const { name, email, address, phone } = contact;
    return [name, email, address, phone].join('').toLowerCase();
  }),
);

const filteredContacts = computed(() => {
  if (!searchText.value) return contacts.value;
  const searchTerm = searchText.value.toLowerCase();
  return contacts.value.filter((contact, index) =>
    searchableContacts.value[index].includes(searchTerm),
  );
});

const selectedContact = computed(() => {
  if (selectedIndex.value < 0) return null;
  return filteredContacts.value[selectedIndex.value];
});

async function retrieveContacts(page) {
  try {
    const chunk = await contactsService.fetchContacts(page, 10);
    totalPages.value = chunk.metadata?.lastPage ?? 1;
    contacts.value = Array.isArray(chunk.contact)
      ? chunk.contact.sort((current, next) => current.name.localeCompare(next.name))
      : [];
    selectedIndex.value = -1;
  } catch (error) {
    console.log('Error retrieving contacts:', error);
    contacts.value = [];
    totalPages.value = 1;
    selectedIndex.value = -1;
  }
}

async function searchContacts(page, searchTerm) {
  try {
    const chunk = await contactsService.searchContacts(page, 10, searchTerm);
    totalPages.value = chunk.metadata?.lastPage ?? 1;
    contacts.value = Array.isArray(chunk.contact)
      ? chunk.contact.sort((current, next) => current.name.localeCompare(next.name))
      : [];
    selectedIndex.value = -1;
    currentPage.value = page;
  } catch (error) {
    console.log('Error searching contacts:', error);
    contacts.value = [];
    totalPages.value = 1;
    selectedIndex.value = -1;
  }
}
async function onDeleteContacts() {
  if (confirm('Bạn có muốn xóa tất cả Liên hệ')) {
    try {
      await contactsService.deleteAllContacts();
      totalPages.value = 1;
      contacts.value = [];
      selectedIndex.value = -1;
      changeCurrentPage(1);
    } catch (error) {
      console.log(error);
    }
  }
}

function goToAddContact() {
  router.push({ name: 'contact.add' });
}

function changeCurrentPage(page) {
  if (searchText.value) {
    searchContacts(page, searchText.value);
  } else {
    retrieveContacts(page);
  }
  router.push({ name: 'contactbook', query: { page } });
}

watch(searchText, (newValue) => {
  console.log('Search text updated:', newValue);
  selectedIndex.value = -1;
  if (newValue) {
    searchContacts(1, newValue);
  } else {
    retrieveContacts(1);
  }
});

watch(
  () => route.query.page,
  (newPage) => {
    const page = Number(newPage) || 1;
    if (searchText.value) {
      searchContacts(page, searchText.value);
    } else {
      retrieveContacts(page);
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="page row mb-5">
    <div class="mt-3 col-md-6">
      <h4>
        Danh bạ
        <i class="fas fa-address-book"></i>
      </h4>
      <div class="my-3">
        <InputSearch v-model="searchText" @search="searchContacts(1, $event)" />
      </div>
      <ContactList
        v-if="filteredContacts.length > 0"
        :contacts="filteredContacts"
        v-model:selected-index="selectedIndex"
      />
      <p v-else>Không có liên hệ nào hiển thị hoặc không tìm thấy kết quả.</p>
      <div class="mt-3">
        <MainPagination
          :total-pages="totalPages"
          :current-page="currentPage"
          @update:current-page="changeCurrentPage"
        />
        <div class="mt-2 d-flex flex-wrap justify-content-between align-items-center">
          <button class="btn btn-sm btn-primary" @click="retrieveContacts(currentPage)">
            <i class="fas fa-redo"></i> Làm mới
          </button>
          <button class="btn btn-sm btn-success" @click="goToAddContact">
            <i class="fas fa-plus"></i> Thêm mới
          </button>
          <button class="btn btn-sm btn-danger" @click="onDeleteContacts">
            <i class="fas fa-trash"></i> Xóa tất cả
          </button>
        </div>
      </div>
    </div>
    <div class="mt-3 col-md-6">
      <div v-if="selectedContact">
        <h4>
          Chi tiết Liên hệ
          <i class="fas fa-address-card"></i>
        </h4>
        <ContactCard :contact="selectedContact" />
        <router-link
          :to="{
            name: 'contact.edit',
            params: { id: selectedContact.id },
          }"
        >
          <span class="mt-2 badge text-bg-warning"> <i class="fas fa-edit"></i> Hiệu chỉnh </span>
        </router-link>
      </div>
      <div v-else>
        <p>Chọn một liên hệ để xem chi tiết.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  text-align: left;
  max-width: 750px;
  margin: 0 auto;
}
</style> -->

<script setup>
import { ref, computed, watch } from 'vue'; // onMounted không cần thiết nữa vì useQuery tự động fetch
import { useRouter, useRoute } from 'vue-router';
import { useQuery, useMutation } from '@tanstack/vue-query';
import ContactCard from '@/components/ContactCard.vue';
import InputSearch from '@/components/InputSearch.vue';
import ContactList from '@/components/ContactList.vue';
import MainPagination from '@/components/MainPagination.vue';
import makeContactsService from '@/services/contacts.service';

const contactsService = makeContactsService();
const router = useRouter();
const route = useRoute();
const selectedIndex = ref(-1);
const searchText = ref('');

const queryKey = computed(() => ['contacts', route.query.page, searchText.value]);

const {
  data: contactsData,
  isLoading,
  error,
} = useQuery({
  queryKey,
  queryFn: () => {
    const page = Number(route.query.page) || 1;
    return searchText.value
      ? contactsService.searchContacts(page, 10, searchText.value)
      : contactsService.fetchContacts(page, 10);
  },
  enabled: true, // Luôn fetch khi component mount
  onSuccess: (data) => {
    // Cập nhật totalPages dựa trên metadata
    totalPages.value = data.metadata?.lastPage ?? 1;
  },
});

const totalPages = ref(1);
const currentPage = ref(Number(route.query.page) || 1);

const filteredContacts = computed(() => {
  if (!contactsData.value?.contact) return [];
  return searchText.value
    ? contactsData.value.contact
    : contactsData.value.contact.filter((contact, index) =>
        searchableContacts.value[index]?.includes(searchText.value.toLowerCase()),
      );
});

const searchableContacts = computed(
  () =>
    contactsData.value?.contact?.map((contact) => {
      const { name, email, address, phone } = contact;
      return [name, email, address, phone].join('').toLowerCase();
    }) || [],
);

const selectedContact = computed(() => {
  if (selectedIndex.value < 0 || !filteredContacts.value.length) return null;
  return filteredContacts.value[selectedIndex.value];
});

// Mutation cho deleteAllContacts
const deleteAllMutation = useMutation({
  mutationFn: () => contactsService.deleteAllContacts(),
  onSuccess: () => {
    // Làm mới danh sách sau khi xóa
    queryClient.refetchQueries(['contacts']); // Giả sử queryClient được cung cấp
    totalPages.value = 1;
    selectedIndex.value = -1;
    currentPage.value = 1;
    router.push({ name: 'contactbook', query: { page: 1 } });
  },
  onError: (error) => {
    console.error('Error deleting all contacts:', error);
  },
});

function goToAddContact() {
  router.push({ name: 'contact.add' });
}

function changeCurrentPage(page) {
  currentPage.value = page;
  router.push({ name: 'contactbook', query: { page } });
}

function onDeleteContacts() {
  if (confirm('Bạn có muốn xóa tất cả Liên hệ')) {
    deleteAllMutation.mutate();
  }
}

watch(searchText, (newValue) => {
  console.log('Search text updated:', newValue);
  selectedIndex.value = -1;
  currentPage.value = 1; // Reset về trang 1 khi tìm kiếm
  router.push({ name: 'contactbook', query: { page: 1 } });
});

watch(
  () => route.query.page,
  (newPage) => {
    currentPage.value = Number(newPage) || 1;
  },
  { immediate: true },
);
</script>

<template>
  <div class="page row mb-5">
    <div class="mt-3 col-md-6">
      <h4>
        Danh bạ
        <i class="fas fa-address-book"></i>
      </h4>
      <div class="my-3">
        <InputSearch v-model="searchText" @search="changeCurrentPage(1)" />
      </div>
      <ContactList
        v-if="!isLoading && filteredContacts.length > 0"
        :contacts="filteredContacts"
        v-model:selected-index="selectedIndex"
      />
      <p v-if="isLoading">Đang tải...</p>
      <p v-if="error" class="alert alert-warning">{{ error.message || 'Lỗi khi tải danh bạ.' }}</p>
      <p v-if="!isLoading && filteredContacts.length === 0">
        Không có liên hệ nào hiển thị hoặc không tìm thấy kết quả.
      </p>
      <div class="mt-3">
        <MainPagination
          :total-pages="totalPages"
          :current-page="currentPage"
          @update:current-page="changeCurrentPage"
        />
        <div class="mt-2 d-flex flex-wrap justify-content-between align-items-center">
          <button class="btn btn-sm btn-primary" @click="changeCurrentPage(currentPage)">
            <i class="fas fa-redo"></i> Làm mới
          </button>
          <button class="btn btn-sm btn-success" @click="goToAddContact">
            <i class="fas fa-plus"></i> Thêm mới
          </button>
          <button class="btn btn-sm btn-danger" @click="onDeleteContacts">
            <i class="fas fa-trash"></i> Xóa tất cả
          </button>
        </div>
      </div>
    </div>
    <div class="mt-3 col-md-6">
      <div v-if="selectedContact">
        <h4>
          Chi tiết Liên hệ
          <i class="fas fa-address-card"></i>
        </h4>
        <ContactCard :contact="selectedContact" />
        <router-link
          :to="{
            name: 'contact.edit',
            params: { id: selectedContact.id },
          }"
        >
          <span class="mt-2 badge text-bg-warning"> <i class="fas fa-edit"></i> Hiệu chỉnh </span>
        </router-link>
      </div>
      <div v-else>
        <p>Chọn một liên hệ để xem chi tiết.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  text-align: left;
  max-width: 750px;
  margin: 0 auto;
}

.alert {
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
}

.alert-warning {
  background-color: #fff3cd;
  border-color: #ffeeba;
  color: #856404;
}
</style>
