const assert = require('assert')
const { Entry } = require('../../src/index')
const { actions } = require('../../src/types')
const { dbconfig } = require('./_db')

const TEST_DATA = [
  { title: 'title-1', content: 'content-1' },
  { title: 'title-2', content: 'content-2' },
  { title: 'title-3', content: 'content-3' }
]

describe('Database read', function () {
  this.timeout(10000)

  let entry = new Entry({ db: dbconfig })

  before(async () => {
    await entry.init()

    // insert data
    const coll = entry.db.collection('test_read')
    await coll.deleteMany({})
    const r = await coll.insertMany(TEST_DATA)
    assert.equal(r.insertedCount, TEST_DATA.length)
  })

  it('read all without query should be ok', async () => {
    let params = {
      collection: 'test_read',
      action: actions.READ
    }
    const data = await entry.execute(params)
    assert.ok(data.list instanceof Array)
    assert.equal(data.list.length, TEST_DATA.length)
  })

  it('read with query should be ok', async () => {
    let params = {
      collection: 'test_read',
      action: actions.READ,
      query: { title: TEST_DATA[0].title }
    }
    const data = await entry.execute(params)
    assert.ok(data.list instanceof Array)
    assert.equal(data.list.length, 1)
    assert.equal(data.list[0].title, TEST_DATA[0].title)
  })

  it('read with order(desc) should be ok', async () => {
    let params = {
      collection: 'test_read',
      action: actions.READ,
      query: {},
      order: [{ field: 'title', direction: 'desc' }]
    }
    const data = await entry.execute(params)
    assert.ok(data.list instanceof Array)
    assert.equal(data.list.length, TEST_DATA.length)
    const lastItem = TEST_DATA[TEST_DATA.length - 1]
    assert.equal(data.list[0].title, lastItem.title)
  })

  it('read with order(asc) should be ok', async () => {
    let params = {
      collection: 'test_read',
      action: actions.READ,
      query: {},
      order: [{ field: 'title', direction: 'asc' }]
    }
    const data = await entry.execute(params)
    assert.ok(data.list instanceof Array)
    assert.equal(data.list.length, TEST_DATA.length)
    assert.equal(data.list[0].title, TEST_DATA[0].title)
  })

  it('read with offset should be ok', async () => {
    let params = {
      collection: 'test_read',
      action: actions.READ,
      query: {},
      offset: 1
    }
    const data = await entry.execute(params)
    assert.ok(data.list instanceof Array)
    assert.equal(data.list.length, TEST_DATA.length - 1)
    assert.equal(data.list[0].title, TEST_DATA[1].title)
  })

  it('read with exceed offset should be ok', async () => {
    let params = {
      collection: 'test_read',
      action: actions.READ,
      query: {},
      offset: 99999
    }
    const data = await entry.execute(params)
    assert.ok(data.list instanceof Array)
    assert.equal(data.list.length, 0)
  })

  it('read with limit = 0 should be ok', async () => {
    let params = {
      collection: 'test_read',
      action: actions.READ,
      query: {},
      order: [{ field: 'title', direction: 'asc' }],
      limit: 0
    }
    const data = await entry.execute(params)
    assert.ok(data.list instanceof Array)
    assert.equal(data.list.length, 3)
    assert.equal(data.list[0].title, TEST_DATA[0].title)
  })

  it('read with limit should be ok', async () => {
    let params = {
      collection: 'test_read',
      action: actions.READ,
      query: {},
      limit: 1
    }
    const data = await entry.execute(params)
    assert.ok(data.list instanceof Array)
    assert.equal(data.list.length, 1)
    assert.equal(data.list[0].title, TEST_DATA[0].title)
  })

  it('read with projection should be ok', async () => {
    let params = {
      collection: 'test_read',
      action: actions.READ,
      query: {},
      projection: { title: 1 }
    }
    const data = await entry.execute(params)
    assert.ok(data.list instanceof Array)
    assert.equal(data.list.length, TEST_DATA.length)
    assert.ok(data.list[0].title)
    assert.ok(data.list[0]._id)
    assert.ok(!data.list[0].content)
  })

  after(async () => {
    const coll = entry.db.collection('test_read')
    await coll.deleteMany({})
    if (entry) entry._accessor._conn.close()
  })
})
