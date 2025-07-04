<script setup>
const model = defineModel({
  type: String,
  default: '',
});

const emit = defineEmits(['search']);

const handleSubmit = () => {
  const searchTerm = (model ?? '').trim();
  if (searchTerm) {
    emit('search', searchTerm); // Only emit if searchTerm is valid
  }
};
</script>

<template>
  <div class="input-group">
    <input
      type="text"
      class="form-control px-3"
      placeholder="Nhập thông tin cần tìm"
      v-model="model"
    />
    <button class="btn btn-outline-secondary" type="button" @click="handleSubmit">
      <i class="fas fa-search"></i>
    </button>
  </div>
</template>

<style scoped>
.input-group {
  width: 100%;
}
.form-control {
  border: 1px solid #ced4da;
  border-right: none;
}
.btn-outline-secondary {
  border-left: none;
}
</style>
