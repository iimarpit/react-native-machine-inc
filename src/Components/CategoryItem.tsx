import React, { useState, useEffect, useMemo } from 'react'
import {
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native'
import { useDispatch } from 'react-redux'
import { Brand } from '@/Components'
import { useTheme } from '@/Hooks'
import tw from 'twrnc'
import {
  Button,
  Checkbox,
  Divider,
  Switch,
  TextInput,
} from 'react-native-paper'
import { addItem, deleteItem, MachineItemState, patchItem } from '@/Store/MachineItems'
import { useSelector } from 'react-redux'
import { MachineState } from '@/Store/Machines'
import DateTimePicker from '@react-native-community/datetimepicker'
import _ from 'lodash'
import moment from 'moment'

const DateInput = (props: any) => (
  <View style={[tw`flex-row justify-start items-start mt-3`]}>
    <Text style={[tw`text-lg mr-4`]}>{props.label}</Text>
    <DateTimePicker
      value={moment(props.value).toDate() || new Date()}
      mode={'date'}
      is24Hour={true}
      onChange={props.onChange}
      style={[tw``]}
    />
  </View>
)

const InputField = (props: any) => {
  const [value, setValue] = useState(props.initialValue)
  const onChange = (event: any, selectedDate: any) => {
    if (selectedDate) {
      setValue(selectedDate)
    } else {
      setValue(event)
    }
    props.afterChange(event, selectedDate, props.field)
  }

  switch (props.type) {
    case 'text':
      return <TextInput {...props} onChangeText={onChange} value={value} />
    case 'number':
      return (
        <TextInput
          {...props}
          value={value}
          onChangeText={onChange}
          keyboardType="decimal-pad"
        />
      )
    case 'date':
      return <DateInput {...props} value={value} onChange={onChange} />
    case 'checkbox':
      return (
        <View style={[tw`flex-row items-center justify-start mt-4`]}>
          <Switch
            value={value}
            onValueChange={() => onChange(!value, undefined)}
          />
          <Text style={[tw`ml-3 text-lg`]}>{props.label}</Text>
        </View>
      )
    default:
      return <TextInput {...props} onChangeText={onChange} value={value} />
  }
}

const CategoryItemComponent = (props: any) => {
  const { category, item }: { category: MachineState; item: MachineItemState } =
    props

  const [attributes, setAttributes] = useState<any[]>(item.attributes || [])

  const dispatch = useDispatch()
  const getCardTitle = () => {
    return item.attributes.find(p => p.name == category.titleField)?.value
  }

  // const title = useMemo(getCardTitle, [item])

  const onChange = (event: any, selectedDate: any, field: any) => {
    let copyAttributes = _.clone(attributes)
    const isExist = copyAttributes.find((attr: any) => attr.name === field.name)
    if (isExist) {
      copyAttributes = copyAttributes.map((attr: any) => {
        if (attr.name === field.name) {
          return {
            ...field,
            value: selectedDate ? moment(selectedDate).toISOString() : event,
          }
        }
        return attr
      })
      setAttributes(copyAttributes)
      dispatch(
        patchItem({
          itemData: { attributes: copyAttributes },
          uuid: item.uuid,
        }),
      )
      return
    } else {
      copyAttributes.push({
        ...field,
        value: selectedDate ? moment(selectedDate).toISOString() : event,
      })
      setAttributes(copyAttributes)
      dispatch(
        patchItem({
          itemData: { attributes: copyAttributes },
          uuid: item.uuid,
        }),
      )
    }
  }

  const getInitialValue = fieldName => {
    return item.attributes?.find(p => p.name == fieldName)?.value
  }
  return (
    <View style={tw`w-full md:w-3/6 p-2`}>
      <View style={[tw`p-2 shadow-lg bg-white rounded-xl`]}>
        <Text style={[tw`text-lg`]}>{getCardTitle() || 'undefined'}</Text>
        {category.fields?.map((field, index) => (
          <InputField
            {...field}
            field={field}
            initialValue={getInitialValue(field.name)}
            label={field.name}
            key={field.name}
            afterChange={onChange}
            mode="outlined"
            style={tw`grow bg-white`}
          />
        ))}
        <Button
          onPress={() => dispatch(deleteItem({ uuid: item.uuid }))}
          icon="delete"
          // mode="outlined"
          style={[tw`w-30`]}
        >
          Remove
        </Button>
      </View>
    </View>
  )
}

export default CategoryItemComponent
