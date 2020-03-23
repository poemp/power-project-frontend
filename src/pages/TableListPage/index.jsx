import React from 'react';
import {ResponsiveGrid} from '@alifd/next';
import PageHeader from '@/components/PageHeader';
import ProjectList from '@/pages/TableListPage/components/ProjectList';

const {Cell} = ResponsiveGrid;

const TableListPage = () => (
  <ResponsiveGrid gap={20}>
    <Cell colSpan={12}>
      <PageHeader
        title="项目管理"
        breadcrumbs={[
          {
            name: '项目管理',
          },
          {
            name: '项目列表',
          },
        ]}
        description="表格列表描述表格列表描述表格列表描述表格列表描述表格列表描述表格列表描述表格列表描述"
      />
    </Cell>

    <Cell colSpan={12}>
      <ProjectList/>
    </Cell>
  </ResponsiveGrid>
);

export default TableListPage;
