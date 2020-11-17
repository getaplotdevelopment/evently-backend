import random from 'lodash.random';
import slugify from 'slugify';

export default item => {
  return `${slugify(item.toLowerCase().trim())}-${random(10000, 20000)}`;
};
