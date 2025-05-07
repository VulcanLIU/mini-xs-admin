<template>
  <div>
    <ElRow class="row-bg" justify="space-evenly">
      <ElCol v-for="item in STATUS_LIST" :key="item" :span="4" gutter="20">
        <div style="text-align: center;">{{ item }}</div>
        <div>
          <Task :task-data="taskDataMap[item].value" :status="item" @drag-end="onTaskDragEnd" />
        </div>
      </ElCol>
    </ElRow>
  </div>
</template>

<script lang="ts" setup>
import Task from "./components/task.vue";
import type { TaskItem, Priority, Status } from "./types/task.ts"
import { STATUS_LIST } from "./types/task.ts"
import { ref, onMounted } from 'vue';

defineOptions({
  name: 'RtTask',
});

const TaskData = ref<TaskItem[]>([
  {
    id: '001',
    issuer: 'pc',
    responser: 'lzp',
    status: 'Doing',
    priority: 'Urgent',
    discription: '完成平台1',
    content: 'ssss',
    node: new Date('1990-01-01'),
  },
  {
    id: '002',
    issuer: 'pc',
    responser: 'lzp',
    status: 'Todo',
    priority: 'Common',
    discription: '完成平台2',
    content: 'ssss',
    node: new Date('1990-01-01'),
  },
  {
    id: '003',
    issuer: 'pc',
    responser: 'lzp',
    status: 'Todo',
    priority: 'Common',
    discription: '完成平台3',
    content: 'ssss',
    node: new Date('1990-01-01'),
  },
]);

const TodoTaskData = ref<TaskItem[]>([]);
const DoingTaskData = ref<TaskItem[]>([]);
const DoneTaskData = ref<TaskItem[]>([]);
const StoppedTaskData = ref<TaskItem[]>([]);

// 状态到数据 ref 的映射
const taskDataMap: Record<Status, typeof TodoTaskData> = {
  Todo: TodoTaskData,
  Doing: DoingTaskData,
  Done: DoneTaskData,
  Stopped: StoppedTaskData
}

// 初始化：按状态分类填充每个 ref
function sortByStatus(raw: TaskItem[], target: Status) {
  return raw.filter(i => i.status === target)
}

onMounted(() => {
  for (const status of STATUS_LIST) {
    taskDataMap[status].value = sortByStatus(TaskData.value, status)
  }
});

// 拖拽处理函数
function onTaskDragEnd({
  fromStatus,
  toStatus,
  oldIndex,
  newIndex,
  fromEl,
  toEl,
  itemEl,
  evt
}: {
  fromStatus: Status
  toStatus: Status
  oldIndex: number
  newIndex: number
  fromEl: HTMLElement
  toEl: HTMLElement
  itemEl: HTMLElement
  evt: any
}) {
  const fromList = taskDataMap[fromStatus].value
  const toList = taskDataMap[toStatus].value

  const taskEl = itemEl as HTMLElement
  const taskId = taskEl.querySelector('.card-header span')?.textContent || ''

  const task = fromList.splice(oldIndex, 1)[0]
  if (task && fromStatus !== toStatus) {
    task.status = toStatus
  }
  toList.splice(newIndex, 0, task)
}
</script>
