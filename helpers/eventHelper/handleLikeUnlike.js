import models from '../../models';
const { Event, Likes } = models;

export default async (email, slug) => {
  let data;

  const likeObj = {
    slug,
    email
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
  const likedBy = [];
  const likedEvents = await Likes.findAll({
    where: {
      slug,
      isLiked: true
    }
  });
  likedEvents.forEach(event => {
    likedBy.push(event.email);
  });
  const isLiked = likedEvents === [] ? false : true;

  await Event.update(
    { likedBy, isLiked },
    {
      where: { slug }
    }
  );
  return {data, likedBy, isLiked}
};
