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