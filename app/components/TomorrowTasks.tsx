import React from 'react';
import TaskList from './TaskList';

export default function TomorrowTasks(props:any) {
  return <TaskList {...props} isSectionList={true} />;
}