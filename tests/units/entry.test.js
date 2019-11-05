const assert = require('assert')
const { Entry, Ruler, MongoAccessor } = require('../../dist')

describe('class Entry', () => {
  const accessor = new MongoAccessor('test-db', 'test-url')

  it('constructor() ok', () => {
    const entry = new Entry(accessor)

    assert.ok(entry.ruler instanceof Ruler)
    assert.ok(entry.accessor instanceof MongoAccessor)
    assert.equal(entry.ruler.accessor, entry.accessor)
  })

  it('parseParams() ok', () => {
    const entry = new Entry(accessor)

    const reqParams = {
      collectionName: 'test-name',
      query: { _id: 'test-id'},
      other: 'test'
    }

    let r = entry.parseParams('database.queryDocument', reqParams)
    
    assert.equal(r.action, 'database.queryDocument')
    assert.equal(r.collection, 'test-name')
    assert.ok(r.query)
    assert.ok(!r.other)
    assert.equal(r.query._id, 'test-id')
  })

  it('parseParams() unknown action should get an error', () => {
    const entry = new Entry(accessor)

    try {
      entry.parseParams('database.unknowAction', {})
      throw new Error('should get an error but not')
    } catch (error) {
      assert.ok(error)
    }
  })
})