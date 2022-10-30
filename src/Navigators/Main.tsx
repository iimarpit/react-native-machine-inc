import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { DashboardContainer } from '@/Containers'
import ManageCategoryContainer from '@/Containers/ManageCategoryContainer'
import CategoryViewContainer from '@/Containers/CategoryViewContainer'
import { Appbar, IconButton, Menu } from 'react-native-paper'
import { Brand } from '@/Components'
import tw from 'twrnc'
import { MachineState } from '@/Store/Machines'
import { useSelector } from 'react-redux'

const CustomNavigationBar = (props: any) => {
  console.log(props, 'orio')
  const [visible, setVisible] = React.useState(false)
  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)

  return (
    <Appbar.Header style={tw`flex justify-between shadow-md bg-white`}>
      <IconButton
        icon="menu-open"
        // iconColor={MD3Colors.error50}
        size={30}
        onPress={props.navigation.toggleDrawer}
      />
      <Brand />
      {!props.back ? (
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={<Appbar.Action icon="menu" onPress={openMenu} />}
        >
          <Menu.Item
            onPress={() => {
              console.log('Option 1 was pressed')
            }}
            title="Option 1"
          />
          <Menu.Item
            onPress={() => {
              console.log('Option 2 was pressed')
            }}
            title="Option 2"
          />
          <Menu.Item
            onPress={() => {
              console.log('Option 3 was pressed')
            }}
            title="Option 3"
            disabled
          />
        </Menu>
      ) : null}
    </Appbar.Header>
  )
}
// const Tab = createBottomTabNavigator()
const Drawer = createDrawerNavigator()
// @refresh reset
const MainNavigator = () => {
  const machines = useSelector(
    (state: { machines: MachineState[] }) => state.machines,
  )
  return (
    <Drawer.Navigator
      screenOptions={{ header: props => <CustomNavigationBar {...props} /> }}
    >
      <Drawer.Screen name="Home" component={DashboardContainer} />
      {machines?.map((p: MachineState, index) => (
        <Drawer.Screen
          key={p.uuid}
          name={`${p.categoryName}` || 'test'}
          component={CategoryViewContainer}
        />
      ))}
      <Drawer.Screen
        name="Manage Categories"
        component={ManageCategoryContainer}
      />
      {/* <Drawer.Screen name="Term&Condition" component={TermsCondition} /> */}
    </Drawer.Navigator>
  )
}

export default MainNavigator
