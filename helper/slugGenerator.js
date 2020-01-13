
import random from 'lodash.random'
import slugify from 'slugify'

export default ((item) => {
    return slugify(item) + '-' + random(10000, 20000)
})