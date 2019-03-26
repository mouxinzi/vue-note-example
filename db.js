const db = new loki('notes',{
  autoload:true,
  autoloadCallback:databaseInitialize,
  autosave:true,
  autosaveInterval:3000
})

function databaseInitialize(){
  const notes = db.getCollection('notes')
  if (notes===null) {
    db.addCollection('notes')
  }
}