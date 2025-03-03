// pages/api/middleware/middleware.js
import { Formidable } from 'formidable';

const formDataParser = async (req, res, next) => { // ✅ Keep next argument
  if (req.method === 'POST' && req.headers['content-type']?.startsWith('multipart/form-data')) {
    const form = new Formidable();
    form.parse(req, (err, fields, files) => {
      if (err) {
        return next(err); // ✅ Call next(err) to pass error to the handler
      }
      req.body = fields;
      req.files = files;
      next();              // ✅ Call next() to proceed
    });
  } else {
    next(); // If not multipart/form-data POST, proceed
  }
};

const middleware = {
  formDataParser,
  // ... other middlewares ...
};

export default middleware;