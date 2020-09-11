import models from '../../models';

const { Event, Likes } = models;

export default async (user, slug) => {
  let data;

  const likeObj = {
    slug,
    user
  };

  const likeValues = await Likes.findOne({
    where: likeObj
  });

  if (likeValues) {
    const { isLiked } = likeValues;
    const row = await Likes.update(
      { isLiked: !isLiked },
      {
        where: likeObj,
        returning: true
      }
    );
    data = row[1][0];
  } else {
    data = await Likes.create(likeObj);
  }
  const likedBy = await Likes.findAll({
    where: {
      slug,
      isLiked: true
    }
  });
  const isLiked = likedBy.length !== 0;
  await Event.update(
    { isLiked },
    {
      where: { slug }
    }
  );
  
  return { data, likedBy, isLiked };
};
