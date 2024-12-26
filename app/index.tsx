import { Text, View, TextInput, Pressable, StyleSheet, FlatList } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { data } from "@/data/todo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import Octicons from "@expo/vector-icons/Octicons";
import Animated, { LinearTransition } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

export default function Index() {
  const [todos, setTodos] = useState<any>([]);
  const [text, setText] = useState("");
  const { colorScheme, setColorScheme, theme }:any = useContext(ThemeContext);
  const [loaded, error] = useFonts({
    Inter_500Medium,
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp");
        const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null;
        if(storageTodos && storageTodos.length > 0){
          setTodos(storageTodos.sort((a:any, b:any) => a.id - b.id));
        }else{
          setTodos(data.sort((a, b) => a.id - b.id));
        }
      } catch(e){
        console.error(e);
      }
    }

    fetchData();
  }, [data]);

  useEffect(() => {
    const storeData = async () => {
      try {
        const jsonValue = JSON.stringify(todos);
        await AsyncStorage.setItem("TodoApp", jsonValue);
      } catch(e){
        console.error(e);
      }
    }
    storeData();
  }, [todos]);

  if(!loaded && !error) return null;

  const styles = createStyles(theme, colorScheme);

  const addTodo = () => {
    if(text.trim()){
      const newId = todos.length > 0 ? todos[0].id + 1: 1;
      setTodos([{id: newId, title: text, completed: false}, ...todos]);
      setText("");
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo:any) => todo.id === id ? {...todo, completed: !todo.completed} : todo));
  }

  const removeTodo = (id: number) => {
    setTodos(todos.filter((todo:any) => todo.id !== id));
  }

  const renderItem = ({item}:any) => (
    <View style={styles.todoItem}>
      <Text
        style={[styles.todoText, item.completed && styles.completedText]}
        onPress={()=> toggleTodo(item.id)}
      >{item.title}</Text>
      <Pressable onPress={()=>removeTodo(item.id)}>
        <MaterialCommunityIcons name="delete-circle" size={36} color="red" />
      </Pressable>
    </View>
  );


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput 
        style={styles.input}
        placeholder="Add a new todo"
        placeholderTextColor="gray"
        value={text}
        onChangeText={setText}
        />
          <Pressable 
          onPress={addTodo}
          style={styles.addButton}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
          <Pressable
            onPress={()=> setColorScheme(colorScheme === "light" ? "dark" : "light")}
            style={{marginLeft: 10}}
          >
            {
              colorScheme === "light" ? (
                <Octicons name="sun" size={36} color={theme.text} />
              ) : (
                <Octicons name="moon" size={36} color={theme.text} />
              )
            }
          </Pressable>
      </View>
      <Animated.FlatList
      data={todos}
      renderItem={renderItem}
      keyExtractor={todo=>todo.id.toString()}
      contentContainerStyle={{flexGrow: 1}}
      itemLayoutAnimation={LinearTransition}
      keyboardDismissMode={"on-drag"}
      />
      <StatusBar style={colorScheme === "light" ? "dark" : "light"} />
    </SafeAreaView>
  );
}

function createStyles(theme:any, colorScheme:any){
  return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    width: "100%",
    maxWidth: 1024,
    marginHorizontal: "auto",
    pointerEvents: "auto",
  },
  input: {
    flex: 1,
    padding: 10,
    borderColor:"gray",
    borderWidth: 1,
    marginRight: 10,
    fontSize: 18,
    fontFamily: "Inter_500Medium",
    minWidth: 0,
    color: theme.text,
  },
  addButton: {
    padding: 10,
    backgroundColor: theme.button,
    borderRadius: 5,
  },
  addButtonText: {
    color: colorScheme === "light" ? "white" : "black",
    fontSize: 18,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
    padding: 10,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    width: "100%",
    maxWidth: 1024,
    marginHorizontal: "auto",
    pointerEvents: "auto",
  },
  todoText: {
    flex: 1,
    fontSize: 18,
    fontFamily: "Inter_500Medium",
    color: theme.text,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "gray",
  },
});}
