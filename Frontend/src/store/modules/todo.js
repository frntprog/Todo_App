export default {
    actions: {
        async fetchTodos(ctx) {
            const res = await fetch('http://localhost:3000/todo', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const todos = await res.json();
            ctx.commit('updateTodos', todos)
        },

        async addTodo(ctx, todo) {
            const res = await fetch('http://localhost:3000/todo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(todo)
            });
            const newTodo = await res.json();
            ctx.commit('addNewTodo', newTodo)
        },

        async deleteTodo(ctx, todoID) {
            await fetch(`http://localhost:3000/todo/one/${todoID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            ctx.commit('setDeleteTodo', todoID);
        },

        async clearDone(ctx) {
            await fetch(`http://localhost:3000/todo/done`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            ctx.commit('deleteCompleted');
        },

        async doneTodo(ctx, payload) {
            await fetch(`http://localhost:3000/todo/${payload.item._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload.changedItem)
            });
            ctx.commit('triggerCompleted', payload.item)
        },

        async editTodo(ctx, payload) {
            await fetch(`http://localhost:3000/todo/edit/${payload.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload.item)
            });
            ctx.commit("editSelectedItem", payload.item)
        },

        async addSubtask(ctx, payload) {
            await fetch(`http://localhost:3000/todo/detailedInfo/${payload.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload.res)
            });
            ctx.commit("addSubTask", payload)
        },

        async deleteSubTask(ctx, payload) {
            await fetch(`http://localhost:3000/todo/delete/subTask/${payload.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload.subTask)
            });
            ctx.commit('setDeleteSubTask', payload);
        },

        changeEditStatus(ctx, payload) {
            ctx.commit('toggleEdit', payload)
        }
    },
    mutations: {
        setDeleteSubTask(state, payload){
            console.log("GO")
            state.todos = state.todos.map(item => {
                if(item._id === payload.id){
                    console.log("SUB")
                    item.detailedInfo = item.detailedInfo.filter(sub => {
                        return sub !== payload.subTask;
                    })
                }
                return item;
            });
        },

        addSubTask(state, payload) {
            console.log("GO")
            state.todos = state.todos.map(todo => {
                if (todo._id === payload.id) {
                    todo.detailedInfo.unshift(payload.res)
                }
                return todo;
            })
            console.log(state.todos)
        },

        editSelectedItem(state, item) {
            console.log("GO")
            state.todos = state.todos.map(todo => {
                if (todo._id === item._id) {
                    return item;
                }
                return todo;
            })
        },

        toggleEdit(state, payload) {
            console.log("GO")
            state.todos = state.todos.map(i => {
                if (i._id === payload.id) {
                    return {
                        ...i,
                        edit: !i.edit,
                        task: payload.edited
                    }
                } else {
                    return {
                        ...i,
                        edit: false,
                    };
                }

            })
        },

        deleteCompleted(state) {
            console.log("GO")
            state.todos = state.todos.filter(todo => todo.completed === false)
        },

        triggerCompleted(state, todo) {
            console.log("GO")
            state.todos = state.todos.map((i) => {
                if (i === todo) {
                    return {
                        ...todo,
                        completed: !todo.completed
                    }
                }
                return i;
            })
        },

        setDeleteTodo(state, deletedTodo) {
            console.log("GO")
            console.log(deletedTodo)
            state.todos = state.todos.filter(todo => todo._id !== deletedTodo);
            console.log(state.todos)
        },

        updateTodos(state, todos) {
            console.log("GO")
            state.todos = todos;
        },

        addNewTodo(state, todo) {
            console.log("GO")
            state.todos.unshift(todo);
        }
    },
    state: {
        todos: []
    },
    getters: {
        unDoneTodos(state) {
            const res = state.todos.filter(todo => todo.completed === false);
            return res;
        },

        doneTodos(state) {
            const res = state.todos.filter(todo => todo.completed === true);
            return res;
        }
    }
}
