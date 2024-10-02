import React from 'react';
import TaskList from './TaskList';

export default function PastCompletedTasks(props:any) {
  return <TaskList {...props} isSectionList={true} />;
}
