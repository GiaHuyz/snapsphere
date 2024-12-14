**Auth**
> call clerk in client

**Pin**
> use pin instead of image
-  get one
  - [x] check id format
  - [x] check pin exist
  - [ ] prevent user from getting other's private pin  
- get all
  - [ ] add filter
  - [ ] filter private pin from other user
- create pin
  - [x] check user authenticated
  - [x] check the image size
  - [x] validate fields
- update pin
  - [x] check user authenticated
  - [x] check owner ship
  - [x] upload new image, delete old image
  - [x] validate fields    
- delete pin
  - [x] check pin exist 
  - [x] check ownership
  - [x] remove image from cloudiary

**Board**
> a collection of pins
