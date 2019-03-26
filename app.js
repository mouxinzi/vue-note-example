
const Editor ={
  props:[
    'entityObject'
  ],
  data() {
    return {
      entity:this.entityObject
    }
  },
  methods: {
    update(){
      this.$emit('update')
    }
  },
  template:`
    <div class="ui form">
      <div class="field">
        <textarea 
        rows="5"
        placeholder="writing something..."
        v-model="entity.body"
        v-on:input="update">
        </textarea>
      </div>
    </div>
    `
}

const Note = {
  props:[
    'entityObject'
  ],
  components:{
    'editor':Editor
  },
  computed: {
    header(){
      return _.truncate(this.entity.body,{length:30})
    },
    updated(){
      return moment(this.entity.meta.updated).fromNow()
    },
    words(){
      return this.entity.body.trim().length
    }
  },
  methods: {
    save(){
      loadCollection('notes')
      .then(collection=>{
        collection.update(this.entity)
        db.saveDatabase()
      })
    },
    destroy(){
      this.$emit('destroy',this.entity.$loki)
    }
  },
  data() {
    return {
      entity: this.entityObject,
      open:false
    }
  },
  template:`
    <div class="item">
     <div class="meta">
          {{updated}}
     </div>
      <div class="content">
        <div class="header"
          v-on:click="open = !open">
          {{header ||'新建笔记'}}
        </div>
        <div class="extra">
          <editor 
            v-bind:entity-object="entity"
            v-if="open"
            v-on:update="save">
          </editor>
          {{words}} 字.
          <i class="right floated trash outline icon"
            v-if="open"
            v-on:click="destroy"></i>
        </div>
      </div>
    </div>
  `
}

const Notes={
  data() {
    return {
      entities:[]
    }
  },
  created() {
    loadCollection('notes')
    .then(collection=>{
     const _entities =  collection.chain()
      .find()
      .simplesort('$loki', 'isdesc')
      .data()
      
      this.entities = _entities
      console.log(this.entities)
      
    })
  },
  methods: {
    create(){
      loadCollection('notes')
      .then((collection) => {
        const entity = collection.insert({
            body:''
          })
        db.saveDatabase()
        this.entities.unshift(entity)
      }) 
    },
    destroy(id){
      const _entities = this.entities.filter((entity)=>{
        return entity.$loki !==id
      })
      this.entities = _entities

      loadCollection('notes')
      .then(collection => {
        collection.remove({'$loki':id})
        db.saveDatabase()
      })
    }
    
  },
  components:{
    'note':Note,
  },
  template:`
     <div class="ui container notes">
      <h4 class="ui horizontal divider header">
        <i class="paw icon">notes app</i>
      </h4>
      <a class="ui right floated basic violet button"
       v-on:click="create" >
        添加笔记
      </a>
      <div class="ui divided items">
        <note
        v-for="entity in entities"
        v-bind:entityObject="entity"
        v-bind:key="entity.$loki"
        v-on:destroy="destroy"></note>
        <span class="ui small disabled header"
          v-if="!this.entities.length">
          还没有笔记...
        </span>
      </div>
    </div>
  `
}

const app = new Vue({
  el:'#app',
  components:{
    'notes':Notes
  },
  template:`<notes></notes>`
})
