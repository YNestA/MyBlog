/**
 * Created by yang on 17-1-30.
 */
function ToDoList() {
    function Todo(desc){
        this.desc=desc;
    }
    var myRemove=function (type,index) {
        console.log(type);
        this.$emit("remove",type,index);
    }
    var getHistory=function(type){
        var _func=function () {
            var res=localStorage.getItem(type);
            if(res!==null){
                return JSON.parse(res).map(function (item) {
                    return new Todo(item.desc);
                });
            }else {
                localStorage.setItem(type,JSON.stringify([]));
                return [];
            }
        }
        return _func;
    }
    Vue.component('not-done-todo',{
        delimiters:["[[","]]"],
        template:"#not-done-todo-template",
        props:{
            "todo":{
                type:Todo,
            },
            "index":{
                type:Number,
            }
        },
        methods:{
            complete:function (event) {
                event.target.blur();
                this.$emit("complete",this.index);
            },
            remove:myRemove,
        },
    });
    Vue.component('done-todo',{
        delimiters:["[[","]]"],
        template:"#done-todo-template",
        props:{
            "todo":{
                type:Todo,
            },
            "index":{
                type:Number,
            }
        },
        methods:{
            uncomplete:function (event) {
                event.target.blur();
                this.$emit("uncomplete",this.index);
            },
            remove:myRemove,
        }
    });
    var ToDoListVM=new Vue({
        el:"#ToDoList",
        delimiters:["[[","]]"],
        data:{
            newTodo:"",
            notDoneTodos:getHistory("notDoneTodos")(),
            doneTodos:getHistory("doneTodos")(),
        },
        methods:{
            addTodo:function(){
                if(this.newTodo) {
                    this.notDoneTodos.push(new Todo(this.newTodo));
                    this.saveHistory();
                    this.newTodo = "";
                }
            },
            clearList:function(event,listType){
                var theTodos=listType==="N"?this.notDoneTodos:this.doneTodos;
                theTodos.splice(0,theTodos.length);
                this.saveHistory();
            },
            completeTodo:function (index) {
                this.doneTodos.push(this.notDoneTodos[index]);
                this.notDoneTodos.splice(index,1);
                this.saveHistory();
            },
            uncompleteTodo:function (index) {
                this.notDoneTodos.push(this.doneTodos[index]);
                this.doneTodos.splice(index,1);
                this.saveHistory();
            },
            removeTodo:function (type,index) {
                var theTodos=type==="N"?this.notDoneTodos:this.doneTodos;
                theTodos.splice(index,1);
                this.saveHistory();
            },
            saveHistory:function () {
                localStorage.setItem("notDoneTodos",JSON.stringify(this.notDoneTodos));
                localStorage.setItem("doneTodos",JSON.stringify(this.doneTodos));
            }
        },
    });
}
window.onload=function () {
    ToDoList();
}
