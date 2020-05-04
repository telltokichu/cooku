import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Popconfirm, Form, Tag, Switch } from 'antd';

const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef();
    const form = useContext(EditableContext);
    useEffect(() => {
        // if (editing) {
        //     inputRef.current.focus();
        // }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async e => {
        try {
            const values = await form.validateFields();
            console.log("values", values[dataIndex])
            toggleEdit();
            record[dataIndex] = values[dataIndex]
            await handleSave({ ...record });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;
    console.log("record ==>", record)
    // console.log('record[dataIndex]', record[dataIndex])
    if (editable) {
        // childNode = editing ? (
        //     <Form.Item
        //         style={{
        //             margin: 0,
        //         }}
        //         name={dataIndex}
        //         rules={[
        //             {
        //                 required: true,
        //                 message: `${title} is required.`,
        //             },
        //         ]}
        //     >
        //         {/* <Input ref={inputRef} onPressEnter={save} onBlur={save} /> */}
        //         <Switch checked={record[dataIndex]} onChange={save} />
        //     </Form.Item>
        // ) : (
        //         <div
        //             className="editable-cell-value-wrap"
        //             style={{
        //                 paddingRight: 24,
        //             }}
        //             onClick={toggleEdit}
        //         >
        //             {children}
        //         </div>
        //     );
        childNode = <Form.Item
            style={{
                margin: 0,
            }}
            name={dataIndex}
        >
            {/* <Input ref={inputRef} onPressEnter={save} onBlur={save} /> */}
            <Switch checked={record[dataIndex] ? record[dataIndex] : false} onChange={save} />
        </Form.Item>
    }

    return <td {...restProps}>{childNode}</td>;
};

export default class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: 'Column(s)',
                dataIndex: 'name',
                width: '30%',
            },
            {
                title: 'Null Check',
                dataIndex: 'nullCheck',
                editable: true,
                render: validated =>
                    <Tag color={validated ? 'green' : 'red'}>
                        {validated ? 'Yes' : 'No'}
                    </Tag>
            },
            {
                title: 'Length Check',
                dataIndex: 'lengthCheck',
                editable: true,
                render: validated =>
                    <Tag color={validated ? 'green' : 'red'}>
                        {validated ? 'Yes' : 'No'}
                    </Tag>
            },
            {
                title: 'Duplicate Check',
                dataIndex: 'duplicateCheck',
                editable: true,
                render: validated =>
                    <Tag color={validated ? 'green' : 'red'}>
                        {validated ? 'Yes' : 'No'}
                    </Tag>
            },
            {
                title: 'Special Character  Check',
                dataIndex: 'specialCharacterCheck',
                editable: true,
                render: validated =>
                    <Tag color={validated ? 'green' : 'red'}>
                        {validated ? 'Yes' : 'No'}
                    </Tag>
            },
        ];
        this.state = {
            visible: false,
            dataSource: [
                {
                    key: '0',
                    name: 'ID',
                    nullCheck: false,
                    lengthCheck: false,
                    duplicateCheck: false,
                    specialCharacterCheck: false,
                },
                {
                    key: '1',
                    name: 'NAME',
                    nullCheck: false,
                    lengthCheck: false,
                    duplicateCheck: false,
                    specialCharacterCheck: false,
                },
                {
                    key: '2',
                    name: 'AGE',
                    nullCheck: false,
                    lengthCheck: false,
                    duplicateCheck: false,
                    specialCharacterCheck: false,
                },
                {
                    key: '3',
                    name: 'GENGER',
                    nullCheck: false,
                    lengthCheck: false,
                    duplicateCheck: false,
                    specialCharacterCheck: false,
                },
            ],
            count: 2,
        };
    }

    handleDelete = key => {
        const dataSource = [...this.state.dataSource];
        this.setState({
            dataSource: dataSource.filter(item => item.key !== key),
        });
    };

    // handleAdd = () => {
    //     const { count, dataSource } = this.state;
    //     const newData = {
    //         key: count,
    //         name: `Edward King ${count}`,
    //         age: 32,
    //         address: `London, Park Lane no. ${count}`,
    //     };
    //     this.setState({
    //         dataSource: [...dataSource, newData],
    //         count: count + 1,
    //     });
    // };

    handleSave = row => {
        console.log("row", row)
        const newData = [...this.state.dataSource];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        console.log("newData", newData)
        this.setState({
            dataSource: newData,
        });
    };
    toggleDrawer = () => {
        this.setState({
            visible: !this.state.visible
        })
    }
    render() {
        const { dataSource } = this.state;
        const components = {
            body: {
                row: EditableRow,
                cell: EditableCell,
            },
        };
        const columns = this.columns.map(col => {
            if (!col.editable) {
                return col;
            }

            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });
        return (
            <div>
                <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                />
            </div>
        );
    }
}