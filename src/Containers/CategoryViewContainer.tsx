import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useDispatch } from 'react-redux'
import { useTheme } from '@/Hooks'
import tw from 'twrnc'
import { Button, Divider } from 'react-native-paper'
import { addItem, MachineItemState } from '@/Store/MachineItems'
import { useSelector } from 'react-redux'
import CategoryItemComponent from '@/Components/CategoryItem'
import { MachineState } from '@/Store/Machines'

const CategoryViewContainer = (props: any) => {
  const { Gutters, Layout } = useTheme()
  const dispatch = useDispatch()
  const items = useSelector(
    (state: { machinesItems: MachineItemState[] }) => state.machinesItems,
  )
  const categories = useSelector(
    (state: { machines: MachineState[] }) => state.machines,
  )
  const category = categories.find(c => {
    return c.uuid === props.route.params.uuid
  })
  console.log(props, 'CategoryViewContainer')

  return (
    <ScrollView
      style={Layout.fill}
      contentContainerStyle={[Gutters.smallHPadding]}
    >
      <View style={[tw`flex-row justify-between items-center my-4`]}>
        <Text style={[tw`text-xl font-bold text-sky-700`]}>
          {category?.categoryName}
        </Text>
        <Button
          mode="contained"
          onPress={() =>
            dispatch(addItem({ categoryUUID: category?.uuid, attributes: [] }))
          }
        >
          Add New {category?.categoryName}
        </Button>
      </View>
      <Divider style={[tw`bg-slate-500`]} />
      <View style={[tw`flex-row flex-wrap`]}>
        {items
          .filter(item => item.categoryUUID == category?.uuid)
          .map(item => (
            <CategoryItemComponent
              category={category}
              item={item}
              key={item.uuid}
            />
          ))}
      </View>
    </ScrollView>
  )
}

export default CategoryViewContainer
