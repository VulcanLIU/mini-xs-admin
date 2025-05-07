<script setup lang="ts">
import useSortable from '@/hooks/web/useSortable';
import { defineProps, defineEmits, PropType, useTemplateRef } from 'vue'
import type { TaskItem, Status } from "../types/task"

const props = defineProps({
  taskData: {
    type: Array as PropType<TaskItem[]>,
    required: true
  },
  status: {
    type: String as PropType<Status>,
    required: true
  }
});

const emit = defineEmits(['drag-end'])

const sortableEl = useTemplateRef<HTMLElement | null>('sortable-ref')
useSortable(
  {
    group: 'task-group',
    animation: 150
  },
  sortableEl
)
</script>

<template>
  <div ref="sortable-ref" class="task-list">
    <ElCard
      v-for="data in taskData"
      class="list-item"
      draggable="true"
    >
      <div class="card-header handle">
        <span>{{ data.discription }}</span>
      </div>
    </ElCard>
  </div>
</template>

<style scoped>
.task-list {
  min-height: 200px;
}

.handle {
  cursor: move;
}
</style>
