<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ContactForm from '@/components/ContactForm.vue';
import ContactList from '@/components/ContactList.vue';
import makeContactsService from '@/services/contacts.service';

const router = useRouter();
const message = ref('');
const contactsService = makeContactsService();

const newContact = ref({
  name: '',
  email: '',
  address: '',
  phone: '',
  favorite: false,
  avatar: '/public/images/blank-profile-picture.png',
});

async function onCreateContact(contactData) {
  try {
    console.log('Contact data to create:', contactData);
    const hasValidField = Array.from(contactData.entries()).some(
      ([key, value]) => value && (typeof value === 'string' ? value.trim() !== '' : true),
    );
    if (!hasValidField) {
      throw new Error('Vui lòng điền ít nhất một trường (name, email, address, phone).');
    }

    const createdContact = await contactsService.createContact(contactData);
    message.value = 'Liên hệ được tạo thành công.';

    setTimeout(() => {
      router.push({
        name: 'contact.edit',
        params: { id: createdContact.id },
      });
    }, 2000);
  } catch (error) {
    console.error('Error creating contact:', error.message);
    message.value = `Có lỗi xảy ra khi tạo liên hệ: ${error.message}`;
  }
}

function onCancelCreate() {
  router.push({ name: 'contactbook' });
}
</script>

<template>
  <div class="page">
    <h4>Thêm Liên hệ mới</h4>
    <ContactForm
      :contact="newContact"
      :is-add-mode="true"
      @submit:contact="onCreateContact"
      @cancel:contact="onCancelCreate"
    />
    <p v-if="message" class="alert alert-info mt-3">{{ message }}</p>
    <ContactList />
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
</style>
