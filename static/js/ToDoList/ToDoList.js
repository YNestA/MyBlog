/**
 * Created by yang on 17-1-30.
 */
function getCurrentTime() {
    var myDate=new Date(),
            year=myDate.getFullYear(),
            month=myDate.getMonth()+1,
            day=myDate.getDate(),
            hour=myDate.getHours(),
            minute=myDate.getMinutes(),
            seconds=myDate.getSeconds();
        if(minute<10){
            minute='0'+minute;
        }
        if(seconds<10){
            seconds='0'+seconds;
        }
        return [year,month,day].join('-')+' '+[hour,minute,seconds].join(':');
}

function Todo(desc,startTime,endTime){
        this.desc=desc;
        this.startTime=startTime?startTime:"";
        this.endTime=endTime?endTime:"";
}
Todo.prototype={
    constructor:Todo,
    getCurrentTime:getCurrentTime,
}
function Note(content,addTime) {
    this.content=content;
    this.addTime=addTime?addTime:Note.prototype.getCurrentTime();
}
Note.prototype={
    constructor:Note,
    getCurrentTime:getCurrentTime,
}

function ToDoList() {
    var todoFuncs={
        myRemove:function (type,index) {
            this.$emit("my-remove",type,index);
        },
        startChange:function () {
            this.changing=true;
            this.$nextTick(function () {
                this.$refs.input.focus();
                this.$refs.input.select();
            });
        },
        myChange:function (type,index) {
            this.changing=false;
            this.$emit("my-change",type,index,this.todo.desc);
        },
        cutSeconds:function (value) {
            return value.slice(0,-3);
        }
    };

    var getHistory=function(type){
        var _func=function () {
            var res=localStorage.getItem(type);
            if(res!==null){
                return JSON.parse(res).map(function (item) {
                    return (type==="notes")? new Note(item.content,item.addTime):new Todo(item.desc,item.startTime,item.endTime);
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
        data:function () {
            return {"changing":false,"hovering":false};
        },
        methods:{
            complete:function (event) {
                event.target.blur();
                this.$emit("complete",this.index);
            },
            myRemove:todoFuncs.myRemove,
            myChange:todoFuncs.myChange,
            startChange:todoFuncs.startChange,
        },
        filters:{
            cutSeconds:todoFuncs.cutSeconds,
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
        data:function () {
            return {"changing":false,"hovering":false};
        },
        methods:{
            uncomplete:function (event) {
                event.target.blur();
                this.$emit("uncomplete",this.index);
            },
            myRemove:todoFuncs.myRemove,
            myChange:todoFuncs.myChange,
            startChange:todoFuncs.startChange,
        },
        filters:{
            cutSeconds:todoFuncs.cutSeconds,
        },
    });
    Vue.component('note',{
        delimiters:["[[","]]"],
        template:"#note-template",
        props:{
            "note":{
                type:Note,
            },
            "index":{
                type:Number,
            },
            "type":{
                type:String,
            }
        },
        computed:{
            phs:function () {
                return this.note.content.split('\n');
            }
        },
        methods:{
            myRemove:todoFuncs.myRemove,
        },
        filters:{
            cutSeconds:todoFuncs.cutSeconds,
        },
    });
    var ToDoListVM=new Vue({
        el:"#ToDoList",
        delimiters:["[[","]]"],
        data:{
            newTodo:"",
            newNote:"",
            notDoneTodos:getHistory("notDoneTodos")(),
            doneTodos:getHistory("doneTodos")(),
            leftNotes:[],
            rightNotes:[],
            noteInputShow:false,
        },
        created:function () {
            var notes=getHistory("notes")(),
                leftLength=0,
                rightLength=0;
            var that=this;
            notes.forEach(function (item) {
                if(leftLength<=rightLength){
                    leftLength+=item.content.split('\n').length;
                    that.leftNotes.push(item);
                }else{
                    rightLength+=item.content.split('\n').length;
                    that.rightNotes.push(item);
                }
            });
        },
        methods:{
            addTodo:function(){
                if(this.newTodo) {
                    this.notDoneTodos.push(new Todo(this.newTodo,Todo.prototype.getCurrentTime()));
                    this.saveTodos();
                    this.newTodo = "";
                }
            },
            showNoteInput:function () {
                this.noteInputShow=!this.noteInputShow;
                this.$nextTick(function () {
                    if(this.noteInputShow){
                        this.$refs.noteInput.focus();
                    }
                });
            },
            dealNoteInput:function (event) {
                if(event.ctrlKey&&event.keyCode){
                    if(this.newNote.trim()) {
                        this._addNote();
                        this.newNote = "";
                    }
                }
            },
            _addNote:function () {
                if($("#left-notes").height()<=$("#right-notes").height()) {
                    this.leftNotes.unshift(new Note(this.newNote));
                }else{
                    this.rightNotes.unshift(new Note(this.newNote));
                }
                this.saveNotes();
                this.goTop();
            },
            clearList:function(event,listType){
                var theTodos=listType==="N"?this.notDoneTodos:this.doneTodos;
                theTodos.splice(0,theTodos.length);
                this.saveTodos();
            },
            completeTodo:function (index) {
                this.notDoneTodos[index].endTime=Todo.prototype.getCurrentTime();
                this.doneTodos.push(this.notDoneTodos[index]);
                this.notDoneTodos.splice(index,1);
                this.saveTodos();
            },
            uncompleteTodo:function (index) {
                this.doneTodos[index].endTime="";
                this.notDoneTodos.push(this.doneTodos[index]);
                this.doneTodos.splice(index,1);
                this.saveTodos();
            },
            removeTodo:function (type,index) {
                var theTodos=type==="N"?this.notDoneTodos:this.doneTodos;
                theTodos.splice(index,1);
                this.saveTodos();
            },
            removeNote:function (type,index) {
                var theNotes=(type==="LN")?this.leftNotes:this.rightNotes;
                theNotes.splice(index,1);
                this.saveNotes();
            },
            changeTodo:function (type,index,desc) {
                var theTodos=type==="N"?this.notDoneTodos:this.doneTodos;
                theTodos[index].desc=desc;
                this.saveTodos();
            },
            saveTodos:function () {
                localStorage.setItem("notDoneTodos",JSON.stringify(this.notDoneTodos));
                localStorage.setItem("doneTodos",JSON.stringify(this.doneTodos));
            },
            saveNotes:function () {
                localStorage.setItem("notes",JSON.stringify(this.leftNotes.concat(this.rightNotes).sort(function (note1,note2) {
                    var splitTime=function (time) {
                        var temp=time.split(' ');
                        return temp[0].split('-').concat(temp[1].split(':')).map(function (item) {
                            return parseInt(item);
                        });
                    }
                    var time1=splitTime(note1.addTime),
                        time2=splitTime(note2.addTime);
                    for(var i=0;i<time1.length;i++){
                        if(time1[i]<time2[i]){
                            return 1;
                        }else if(time1[i]>time2[i]) {
                            return -1;
                        }
                    }
                    return 0;
                })));
            },
            goTop:function () {
                $("html,body").animate({scrollTop:$("#ToDoList").offset().top},500,"linear");
            }
        },
    });
}
$(document).ready(function () {
    ToDoList();
});

function quickSort(arr) {
    var quick=function (arr,left,right) {
        if(right<=left) return;
        arr[right]=[arr[parseInt((right+left)/2)],arr[parseInt((right+left)/2)]=arr[right]][0]
        var index=left;
        for(var i=left;i<right;i++){
            if(arr[i]<arr[right]){
                arr[i]=[arr[index],arr[index]=arr[i]][0];
                index+=1;
            }
        }
        arr[right]=[arr[index],arr[index]=arr[right]][0];
        if(right-left>1) {
            arguments.callee(arr, left, index - 1);
            arguments.callee(arr, index + 1, right);
        }
    }
    quick(arr,0,arr.length-1);
}