/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@/Hooks'
import {
  MachineState,
  addCategory,
  MachineField,
  deleteCategory,
  patchCategory,
} from '@/Store/Machines'
import tw from 'twrnc'
import {
  Button,
  Dialog,
  FAB,
  IconButton,
  Menu,
  Portal,
  Snackbar,
  TextInput,
} from 'react-native-paper'
import _ from 'lodash'
// import { Dimensions } from 'react-native'

// const window = Dimensions.get('window')

const iconMap = {
  date: 'calendar-month',
  number: 'numeric-3-box-outline',
  text: 'format-color-text',
  checkbox: 'checkbox-marked',
}

const MachineAttributeField = (props: any) => {
  const [visible, setVisible] = React.useState(false)
  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)
  const [activeMenuItem, setActiveMenuItem] = React.useState<
    'text' | 'date' | 'checkbox' | 'number'
  >(props.field?.type || 'text')

  const changeFieldType = (type: 'text' | 'date' | 'checkbox' | 'number') => {
    setActiveMenuItem(type)
    closeMenu()
    props.updateField({ type }, props.fieldId)
  }
  return (
    <View style={[tw`flex flex-row items-center justify-between`]}>
      <TextInput
        label={'Attribute Name'}
        value={props.field.name}
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
            mode="contained"
            style={[tw`rounded-none mt-3`]}
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

const CategoryComponent = (props: any) => {
  const [categoryName, setCategoryName] = React.useState(
    props.overloadCategory?.categoryName || '',
  )
  const [fields, setFields] = React.useState<MachineField[] | []>(
    props.overloadCategory?.fields || [],
  )
  const [visible, setVisible] = React.useState(false)
  const [titleField, setTitleField] = React.useState<string>(
    props.overloadCategory?.titleField || 'UnamedField',
  )

  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)
  const addField = () => {
    const copyFields: any = _.clone(fields)
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

  const deleteField = (fieldId: number) => {
    let copyFields = _.clone(fields)
    copyFields = copyFields.filter((field, index) => index != fieldId)
    setFields(copyFields)
  }

  useEffect(() => {
    props.updateCategory({
      categoryName,
      fields,
      titleField,
    })
  }, [categoryName, fields, titleField])

  return (
    <>
      <View style={[tw``]}>
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
            field={field}
            key={index}
          />
        ))}
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Button style={[tw`mt-2 `]} mode="contained" onPress={openMenu}>
              Title Field: {titleField}
            </Button>
          }
        >
          {fields.map((field, index) => (
            <Menu.Item
              leadingIcon={iconMap[field.type]}
              onPress={() => {
                setTitleField(field.name)
              }}
              title={field.name}
              key={index}
            />
          ))}
        </Menu>
        <View style={tw`flex-row justify-between mt-2`}>
          <Button style={[tw`text-xs`]} mode="outlined" onPress={addField}>
            Add New Field
          </Button>
          {props.deleteCategory && (
            <Button
              onPress={props.deleteCategory}
              icon="delete"
              mode="outlined"
              style={[tw``]}
            >
              Remove
            </Button>
          )}
        </View>
      </View>
    </>
  )
}

const ManageCategoryContainer = () => {
  const { Gutters, Layout } = useTheme()
  const dispatch = useDispatch()
  const [dialogVisible, setDialogVisible] = React.useState(false)
  const [snackbarVisible, setSnackbarVisible] = React.useState(false)
  const [snackbarMessage, setSnackbarMessage] = React.useState('')

  const showSnackBar = async (message = '') => {
    await setSnackbarMessage(message)
    setSnackbarVisible(true)
  }

  const onDismissSnackBar = () => setSnackbarVisible(false)
  const [categoryToAdd, setCategoryToAdd] = React.useState<
    MachineState | undefined
  >(undefined)

  const showDialog = () => setDialogVisible(true)

  const hideDialog = () => setDialogVisible(false)

  const machines = useSelector(
    (state: { machines: MachineState[] }) => state.machines,
  )

  const submitCategory = () => {
    if (!categoryToAdd?.categoryName) {
      showSnackBar('Category Name is required')
      return
    }
    const fieldDuplicatesMap: any = {}
    categoryToAdd?.fields?.forEach(element => {
      const field_key = element.name.replace(/\s+/g, '_').toLowerCase()
      if (fieldDuplicatesMap[field_key]) {
        fieldDuplicatesMap[field_key] = fieldDuplicatesMap[field_key] + 1
      } else {
        fieldDuplicatesMap[field_key] = 1
      }
    })
    for (const key in fieldDuplicatesMap) {
      if (fieldDuplicatesMap[key] > 1) {
        showSnackBar('Please Avoid Duplicate Names')
        return
      }
    }

    const duplicateName = machines.find(
      p => p.categoryName == categoryToAdd.categoryName,
    )
    if (duplicateName) {
      showSnackBar('Category with same name already exist')
      return
    }

    dispatch(addCategory(categoryToAdd))
    hideDialog()
  }

  return (
    <>
      <ScrollView
        style={Layout.fill}
        contentContainerStyle={[Gutters.smallHPadding]}
      >
        <Text style={[tw`text-xl font-bold text-sky-700	mt-4`]}>
          Manage Categories
        </Text>
        <View style={[tw`md:flex-row flex-wrap items-stretch`]}>
          {machines.map((machine, index) => (
            <View style={[tw`w-full md:w-3/6 p-3`]} key={index}>
              <View style={tw`rounded-xl shadow-lg p-3 bg-white`}>
                <CategoryComponent
                  overloadCategory={machine}
                  updateCategory={(categoryData: any) =>
                    dispatch(
                      patchCategory({ categoryData, uuid: machine.uuid }),
                    )
                  }
                  deleteCategory={() =>
                    dispatch(deleteCategory({ uuid: machine.uuid }))
                  }
                />
              </View>
            </View>
          ))}
        </View>
        <Portal>
          <Dialog
            visible={dialogVisible}
            onDismiss={hideDialog}
            style={[tw.style('bg-white', 'md:w-full', 'md:self-center')]}
            dismissable={false}
          >
            <Dialog.Title>Add Machine Category</Dialog.Title>
            <Dialog.Content>
              <CategoryComponent updateCategory={setCategoryToAdd} />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={submitCategory}>Add</Button>
              <Button onPress={hideDialog}>Cancel</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
      <FAB
        icon="plus"
        style={[tw`absolute m-5 right-0 bottom-0 bg-blue-500`]}
        onPress={showDialog}
        mode="elevated"
        customSize={60}
      />
      <Snackbar visible={snackbarVisible} onDismiss={onDismissSnackBar}>
        {snackbarMessage}
      </Snackbar>
    </>
  )
}

// const styles = StyleSheet.create({
//   Dialog: {
//     width: window.width * 0.8,
//   },
// })

export default ManageCategoryContainer
