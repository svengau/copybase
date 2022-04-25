let error = true

let res = [
  db.post.drop(),
  db.post.insert({ title: 'hello', user: 1 }),
  db.post.insert({ title: 'hello2', user: 1 }),
  db.post.insert({ title: 'hello3', user: 1 }),
  db.post.insert({ title: 'hello3', user: 1 })
]

printjson(res)

if (error) {
  print('Error, exiting')
  quit(1)
}