import React, { useState, useEffect } from 'react'
import {
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Brand } from '@/Components'
import { useTheme } from '@/Hooks'
import { useLazyFetchOneQuery } from '@/Services/modules/users'
import { MachineState, addCategory, MachineField } from '@/Store/Machines'
import tw from 'twrnc'
import {
  Button,
  Dialog,
  FAB,
  IconButton,
  Menu,
  Paragraph,
  Portal,
  TextInput,
} from 'react-native-paper'
import _ from 'lodash'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const MachineAttributeField = (props: any) => {
  const [visible, setVisible] = React.useState(false)
  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)
  const [activeMenuItem, setActiveMenuItem] = React.useState<
    'text' | 'date' | 'checkbox' | 'number'
  >('text')

  const iconMap = {
    date: 'calendar-month',
    number: 'numeric-3-box-outline',
    text: 'format-color-text',
    checkbox: 'checkbox-marked',
  }

  const changeFieldType = (type: 'text' | 'date' | 'checkbox' | 'number') => {
    setActiveMenuItem(type)
    closeMenu()
    props.updateField({ type }, props.fieldId)
  }
  return (
    <View style={[tw`flex flex-row items-center justify-between gap-2`]}>
      <TextInput
        label={'Attribute Name'}
        value={props.value}
        onChangeText={text => props.updateField({ name: text }, props.fieldId)}
        mode="outlined"
        style={tw`grow bg-white`}
      />
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <IconButton
            icon={iconMap[activeMenuItem]}
            size={30}
            onPress={openMenu}
          />
        }
      >
        <Menu.Item
          leadingIcon={iconMap.text}
          onPress={() => {
            changeFieldType('text')
          }}
          title="Text"
        />
        <Menu.Item
          leadingIcon={iconMap.number}
          onPress={() => {
            changeFieldType('number')
          }}
          title="Number"
        />
        <Menu.Item
          leadingIcon={iconMap.date}
          onPress={() => {
            changeFieldType('date')
          }}
          title="Date"
        />
        <Menu.Item
          leadingIcon={iconMap.checkbox}
          onPress={() => {
            changeFieldType('checkbox')
          }}
          title="CheckBox"
        />
      </Menu>
      <IconButton
        icon={'delete'}
        size={30}
        onPress={() => props.deleteField(props.fieldId)}
      />
    </View>
  )
}

const AddCategoryComponent = props => {
  const [categoryName, setCategoryName] = React.useState('')
  const [fields, setFields] = React.useState<MachineField[] | []>([])
  const addField = () => {
    const copyFields = _.clone(fields)
    copyFields.push({ type: 'text', name: '' })
    setFields(copyFields)
  }

  const updateField = (partialFieldData: any, fieldId: any) => {
    let copyFields = _.clone(fields)
    copyFields = copyFields.map((field, index) => {
      if (index == fieldId) {
        return { ...field, ...partialFieldData }
      }
      return field
    })
    setFields(copyFields)
  }

  const deleteField = fieldId => {
    let copyFields = _.clone(fields)
    copyFields = copyFields.filter((field, index) => index != fieldId)
    setFields(copyFields)
  }
  return (
    <>
      <View>
        <TextInput
          label="Category Name"
          value={categoryName}
          onChangeText={text => setCategoryName(text)}
          mode="outlined"
        />
        {fields.map((field, index) => (
          <MachineAttributeField
            updateField={updateField}
            deleteField={deleteField}
            fieldId={index}
            value={field.name}
          />
        ))}
        <Button style={[tw`mt-2`]} mode="contained" onPress={addField}>Add Attribute Field</Button>
      </View>
    </>
  )
}

const ManageCategoryContainer = () => {
  const { Common, Fonts, Gutters, Layout } = useTheme()
  const dispatch = useDispatch()
  const [visible, setVisible] = React.useState(false)

  const showDialog = () => setVisible(true)

  const hideDialog = () => setVisible(false)

  const machines = useSelector(
    (state: { machines: MachineState }) => state.machines,
  )

  // useEffect(() => {
  //   useSelector()
  // })

  // const onChangeTheme = ({ theme, darkMode }: Partial<ThemeState>) => {
  //   dispatch(changeTheme({ theme, darkMode }))
  // }
  const addMachine = () => {
    dispatch(
      addCategory({
        categoryName: 'arpit',
        fields: [{}, {}],
        titleField: 'arpit',
      }),
    )
  }

  return (
    <ScrollView
      style={Layout.fill}
      contentContainerStyle={[
        Layout.fill,
        Layout.colCenter,
        Gutters.smallHPadding,
      ]}
    >
      <Text>Manage Categories</Text>
      <Text>{JSON.stringify(machines)}</Text>
      <FAB
        icon="plus"
        style={[tw`absolute m-5 right-0 bottom-0 bg-blue-500`]}
        onPress={showDialog}
        mode="elevated"
        customSize={60}
      />
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog} style={[tw`bg-white`]}>
          <Dialog.Title>Add Machine Category</Dialog.Title>
          <Dialog.Content>
            <AddCategoryComponent />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Add</Button>
            <Button onPress={hideDialog}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  )
}

export default ManageCategoryContainer
