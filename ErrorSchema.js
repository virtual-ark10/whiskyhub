import BaseJoi from "joi";
import sanitizeHTML from "sanitize-html";

const customJoi = BaseJoi.defaults((schema) => {
  if (schema.type === 'string') {
    return schema.custom((value, helpers) => {
      const clean = sanitizeHTML(value, {
        allowedTags: [],
        allowedAttributes: {},
      });
      if (clean !== value) {
        return helpers.message(`${helpers.state.path.join('.')} must not include HTML!`);
      }
      return clean;
    }, 'escape HTML');
  }
  return schema;
});

// Define your schemas as normal
const whiskyJoiSchema = customJoi.object({
  whiskies: customJoi.object({
    name: customJoi.string().required().min(3).max(25),
    type: customJoi.string().required().min(3).max(30),
    price: customJoi.number().required().min(0),
    description: customJoi.string().required()
  }).required()
});

const reviewSchema = customJoi.object({
  review: customJoi.object({
    rating: customJoi.number().required().min(1).max(5),
    body: customJoi.string().required()
  }).required()
});

export { whiskyJoiSchema, reviewSchema };
