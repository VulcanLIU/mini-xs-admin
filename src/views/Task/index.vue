<script lang="ts" setup>
  import { useUserInfoStoreHook } from '@/store/modules/user';
  import { onMounted, ref } from 'vue';
  import Sidebar from '../Sidebar/index.vue';
  import fetchdata from './components/fetchdata.vue';
  import Task from './components/task.vue';
  import { STATUS_LIST } from './types/task';
  import type { Status, TaskParams } from './types/task';

  defineOptions({
    name: 'RtTask',
  });

  //获取子组件实例
  const childRef = ref<InstanceType<typeof fetchdata> | null>(null);

  const titleMap: Record<Status, string> = {
    Todo: '待办',
    Doing: '执行中',
    Done: '完成',
    Stopped: '暂停',
  };

  //任务数据
  const TaskData2 = ref<TaskParams[]>([]);
  const TodoTaskData = ref<TaskParams[]>([]);
  const DoingTaskData = ref<TaskParams[]>([]);
  const DoneTaskData = ref<TaskParams[]>([]);
  const StoppedTaskData = ref<TaskParams[]>([]);

  //|——对任务数据进行归类状态到数据 ref 的映射
  const taskDataMap: Record<Status, typeof TodoTaskData> = {
    Todo: TodoTaskData,
    Doing: DoingTaskData,
    Done: DoneTaskData,
    Stopped: StoppedTaskData,
  };

  // 初始化：按状态分类填充每个 ref
  function sortByStatus(raw: TaskParams[], target: Status) {
    return raw.filter(i => i.status === target);
  }

  //子组件完成数据获取后完成此回调函数
  function loadData() {
    //
    for (const status of STATUS_LIST) {
      taskDataMap[status].value = sortByStatus(TaskData2.value, status);
    }
  }

  onMounted(() => {
    //拉取数据-该用户的任务数据
    FetchData(TaskData2.value);
  });

  //调用子组件函数获取数据
  function FetchData(task_data: TaskParams[]) {
    childRef.value?.FetchData(task_data);
  }

  // 拖拽处理函数
  function onTaskDragEnd({
    fromStatus,
    toStatus,
    oldIndex,
    newIndex,
    fromEl,
    toEl,
    itemEl,
    evt,
  }: {
    fromStatus: Status;
    toStatus: Status;
    oldIndex: number;
    newIndex: number;
    fromEl: HTMLElement;
    toEl: HTMLElement;
    itemEl: HTMLElement;
    evt: any;
  }) {
    const fromList = taskDataMap[fromStatus].value;
    const toList = taskDataMap[toStatus].value;

    const taskEl = itemEl as HTMLElement;
    const taskId = taskEl.querySelector('.card-header span')?.textContent || '';

    const task = fromList.splice(oldIndex, 1)[0];
    if (task && fromStatus !== toStatus) {
      task.status = toStatus;
    }
    toList.splice(newIndex, 0, task);
    console.log(TodoTaskData.value);
    console.log(DoingTaskData.value);
  }

  //子组件中，任务状态在界面上修改后在此处对数组修改，由于都是响应式数据会再次传递到子组件中
  function handleData(previousState: Status, targetState: Status, index: number) {
    const tt: TaskParams = taskDataMap[previousState].value[index];
    tt.status = targetState;
    taskDataMap[previousState].value.splice(index, 1); //删除来源数组中的任务
    taskDataMap[targetState].value.push(tt);
  }
</script>

<template>
  <div>
    <ElRow class="row-bg" justify="space-evenly">
      <ElCol v-for="item in STATUS_LIST" :key="item" :span="6" gutter="20">
        <div class="column-header">{{ titleMap[item] }}</div>
        <div v-for="(data, index) in taskDataMap[item].value" :key="index">
          <Task
            :task-data="data"
            :status="item"
            @status-changed="targetState => handleData(item, targetState, index)"
          />
        </div>
      </ElCol>
    </ElRow>
    <fetchdata ref="childRef" @submit-form="loadData" />
  </div>
</template>

<style>
  .column-header {
    color: #6b7280; /* medium grey 颜色值 */
    font-weight: 700; /* 相当于 font-bold */
    font-size: 1rem; /* 12px，相当于 text-xs */
    text-transform: uppercase;
    text-align: center;
  }
</style>
