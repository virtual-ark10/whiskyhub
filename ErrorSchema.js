import Joi from "joi";
// import sanitizeHTML from "sanitize-html";

// const customJoi = BaseJoi.defaults((schema) => {
//   if (schema.type === 'string') {
//     return schema.custom((value, helpers) => {
//       const clean = sanitizeHTML(value, {
//         allowedTags: [],
//         allowedAttributes: {},
//       });
//       if (clean !== value) {
//         return helpers.message(`${helpers.state.path.join('.')} must not include HTML!`);
//       }
//       return clean;
//     }, 'escape HTML');
//   }
//   return schema;
// });

// Define your schemas as normal
const whiskyJoiSchema = Joi.object({
  whiskies: Joi.object({
    name: Joi.string().required().min(3).max(45),
    type: Joi.string().required().min(3).max(30),
    price: Joi.number().required().min(0),
    image: Joi.string().uri().required(),
    description: Joi.string().required()
  })
});

const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required()
  }).required()
});

export { whiskyJoiSchema, reviewSchema };
