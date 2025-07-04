<script setup>
import { ref, useTemplateRef } from 'vue';
import { Form as VeeForm, Field as VeeField, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const props = defineProps({
  contact: { type: Object, required: true },
  isAddMode: { type: Boolean, default: false },
});

const avatarFileInput = useTemplateRef('avatar-file-input');
const avatarFile = ref(props.contact.avatar || '/public/images/blank-profile-picture.png');
const $emit = defineEmits(['submit:contact', 'delete:contact', 'cancel:contact']);

const validationSchema = toTypedSchema(
  z
    .object({
      name: z
        .string()
        .min(2, { message: 'Tên phải ít nhất 2 ký tự.' })
        .max(50, { message: 'Tên có nhiều nhất 50 ký tự.' })
        .optional(),
      email: z
        .string()
        .email({ message: 'E-mail không đúng.' })
        .max(50, { message: 'E-mail tối đa 50 ký tự.' })
        .optional(),
      address: z.string().max(100, { message: 'Địa chỉ tối đa 100 ký tự.' }).optional(),
      phone: z
        .string()
        .regex(/(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/, {
          message: 'Số điện thoại không hợp lệ.',
        })
        .optional(),
      favorite: z.number().optional(),
      avatarFile: z.instanceof(File).optional(),
    })
    .refine(
      (data) => {
        return Object.values(data).some(
          (value) => value && (typeof value === 'string' ? value.trim() !== '' : true),
        );
      },
      {
        message: 'Vui lòng điền ít nhất một trường (name, email, address, phone).',
        path: ['name'],
      },
    ),
);

function previewAvatarFile(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (evt) => {
      avatarFile.value = evt.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function submitContact(values) {
  const formData = new FormData();
  let hasValidField = false;

  for (const key in values) {
    if (values[key] !== undefined) {
      if (key === 'avatarFile' && values[key] instanceof File) {
        formData.append(key, values[key]);
        hasValidField = true;
      } else if (typeof values[key] === 'string' && values[key].trim() !== '') {
        formData.append(key, values[key].trim());
        hasValidField = true;
      } else if (typeof values[key] !== 'string' && values[key] !== undefined) {
        formData.append(key, values[key]);
        hasValidField = true;
      }
    }
  }

  if (!hasValidField) {
    throw new Error('Vui lòng điền ít nhất một trường (name, email, address, phone).');
  }

  $emit('submit:contact', formData);
}

function cancelForm() {
  $emit('cancel:contact');
}
</script>

<template>
  <VeeForm :validation-schema="validationSchema" @submit="submitContact">
    <div class="mb-3 w-50 h-50">
      <img
        class="img-fluid img-thumbnail"
        :src="avatarFile"
        alt="Avatar"
        @click="avatarFileInput.click()"
      />
      <VeeField name="avatarFile" v-slot="{ handleChange }">
        <input
          type="file"
          class="d-none"
          ref="avatar-file-input"
          accept="image/*"
          @change="
            (event) => {
              handleChange(event);
              previewAvatarFile(event);
            }
          "
        />
      </VeeField>
    </div>
    <div class="mb-3">
      <label for="name" class="form-label">Tên</label>
      <VeeField name="name" type="text" class="form-control" v-model="contact.name" />
      <ErrorMessage name="name" class="error-feedback" />
    </div>
    <div class="mb-3">
      <label for="email" class="form-label">E-mail</label>
      <VeeField name="email" type="email" class="form-control" v-model="contact.email" />
      <ErrorMessage name="email" class="error-feedback" />
    </div>
    <div class="mb-3">
      <label for="address" class="form-label">Địa chỉ</label>
      <VeeField name="address" type="text" class="form-control" v-model="contact.address" />
      <ErrorMessage name="address" class="error-feedback" />
    </div>
    <div class="mb-3">
      <label for="phone" class="form-label">Điện thoại</label>
      <VeeField name="phone" type="tel" class="form-control" v-model="contact.phone" />
      <ErrorMessage name="phone" class="error-feedback" />
    </div>
    <div class="mb-3 form-check">
      <VeeField
        name="favorite"
        type="checkbox"
        class="form-check-input"
        v-model="contact.favorite"
        :value="1"
        :unchecked-value="0"
      />
      <label for="favorite" class="form-check-label">
        <strong>Liên hệ yêu thích</strong>
      </label>
    </div>
    <div class="mb-3">
      <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Lưu</button>
      <button
        v-if="!isAddMode"
        type="button"
        class="ms-2 btn btn-danger"
        @click="$emit('delete:contact', contact.id)"
      >
        <i class="fas fa-trash"></i> Xóa
      </button>
      <button type="button" class="ms-2 btn btn-secondary" @click="cancelForm">
        <i class="fas fa-times"></i> Hủy
      </button>
    </div>
  </VeeForm>
</template>

<style scoped>
@import '@/assets/form.css';
</style>
