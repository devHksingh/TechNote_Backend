import multer from "multer";
import path from "node:path";


export const upload = multer({
    dest:path.resolve(__dirname,'../../public/data/uploads'),
    limits:{fieldSize:1e6}
})