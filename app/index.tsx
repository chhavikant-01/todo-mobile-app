import { Text, View, TextInput, Pressable, StyleSheet, FlatList } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { data } from "@/data/todo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function Index() {
  const [todos, setTodos] = useState(data.sort((a, b) => a.id - b.id));
  const [text, setText] = useState("");

  const addTodo = () => {
    if(text.trim()){
      const newId = todos.length > 0 ? todos[0].id + 1: 1;
      setTodos([{id: newId, title: text, completed: false}, ...todos]);
      setText("");
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => todo.id === id ? {...todo, completed: !todo.completed} : todo));
  }

  const removeTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
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
      </View>
      <FlatList
      data={todos}
      renderItem={renderItem}
      keyExtractor={todo=>todo.id.toString()}
      contentContainerStyle={{flexGrow: 1}}
      />
        
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
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
    minWidth: 0,
    color: "white",
  },
  addButton: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
  addButtonText: {
    color: "black",
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
    color: "white",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "gray",
  },
});
