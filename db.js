

const db = new loki('notes',{
  autoload:true,
  autoloadCallback:databaseInitiallize,
  autosave:true,
  autosaveInterval:3000
})

function  databaseInitiallize(){
  const notes = db.getCollection('notes')
  
  if(notes===null){
    db.addCollection('notes')
  }
}

function loadCollection(collection) {
  return new Promise(resolve=>{
    db.loadDatabase({},()=>{
      const _collection = db.getCollection(collection)||db.addCollection(collection)
      resolve(_collection)
    })
  })
}
