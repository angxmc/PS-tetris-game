# Tetris Game
------
1. create a container element to hold tetris grid and block in HTML
2. create a CSS file and style the container and grid elements 
3. logic of the game in JS: to generate and manipulate

# Game Logic: 
1. randomly generate the different shapes of tetris blocks
2. the moving blocks can move left and right, rotate
3. when the blocks reach the bottom, they can no longer move, at the same time, generate a new moving block
4. when an entire row has been filled , it will disappear and what's above will move down. 
5. when the static blocks has reached the top of the game board, the game is over. 

# What each step should do?
1. create a 200px * 360px container in the background
2. create a 20px * 20px block on the container 
3. control the block to move, every step 20px
4. divide the container to 18 rows and 10 col, each row is 20 px in height 
5. create a L tetris shape in a 4 * 4 square box and use this 16-grid as the container of all shapes. (this all happen in the 18rwo-10col container)
6. manipulate this shape to move --> moving the 16-grid square box
7. rotate this model
8. make sure the model only moves within the background container
9. when the shape reaches the bottom, it will stop moving, change to a gray-scale color and generates a new block
10. determine the collision between the blocks: side collision and bottom collision
11. provide a function of what it would do when the side of the blocks touches.
12. provide a function of what it would do when the bottom border are touched
13. determine if a row is being filled with blocks 
14. clear out the filled row
15. move all the blocks above the cleared row down
16. generate various shapes and generate a random shape based on random number, create a method to have it drop automatically


## where to start?
- we need a container for the game: 200px x 360px
- create a 20px x 20px block element (to demo and try moving just one block)
- control the block element to move, every time moves 20px
- divide the container to 18 rows an d10 columns so it looks like a grid/graph paper. each column is 20px
- we need to have a concept of a 4x4 grid within the container, use this 16 grid to form the shapes


For Example: the L shape: 
   0 1 2 3
0
1      4
2  1 2 3
3

- it's formed by 4 blocks
- the 1st block is at row 2, col 0
- the 2nd block is at row 2 col 1
- the 3rd is at row 2 col 3
- the 4th is at row 1 col 2
- we can use the row # and col# to locate the L shape. 
- in order to construct the 1st block, we can just use the index of the row and col

## Steps towards creating this game:

- having the prior knowledge in mind, we now have created one rotation of the L shape block element in the *MODELS* variable 
- we need to declare a variable that will hold one shape at a time while it's being moved *currentModel*
- we want to create the shape on the container as it enters our container, not all the shapes have to be 'seen' at the moment. only the one that's going to enter our container. So we create a function to position the blocks *locationBlocks*. 
- In *locationBlocks*, we declared another variable to hold all the DIVs/blocks created to form that one shape, and we looped through that variable to reach each block/square of the tetris shape. 
- Once we have picked out the blocks, we are going to assign the positions of each individual blocks: *blockModel*. We only need top and left because we are using negative and positive numbers. the top and left act as the x, y axis. 
- However, we are only moving one block out of the shape. we want to move the entire shape. 
- so we are going to use the 4x4, 16-gird box that we had in mind earlier, to move the shape. 
-Basically, we have this 4x4 box that contains the shape, and we are moving the box to move the shape inside. 
-__Rotation__:
    - we need to find the pattern of how the location of the shape rotate within the 4x4 box
      0 1 2 3        0 1 2 3          0 1 2 3
    0   1          0                0 
    1   2          1   3 2 1        1   4 3
    2   3 4        2   4            2     2
    3              3                3     1
    - block 1:row=0;col=1 (1st)
    - block 2: row=1; col=3 (2nd)
    - block 3: row=3; col=2 (3rd)
    - the pattern for row # is that the column number will equal to it's row number after each rotation
    - the pattern for col# = 3-the row#, for each rotation

### How to limit the shapes to moving within the container?
- to control the shape model, we need a method/function to complete this actions for us. 
- when the block reach the left, right, and bottom, every time it exceeds the boundary, it will take one step back. so it cancels. 
-so the function should detect when the shape within the 4x4 box touches the border

### When the blocks reaches the bottom, it will become static and a new one will generate
- again, we need a function to help us complete this action
- first we need to create another style to distinguish teh fixed blocks and the moving blocks. 
- give it a new class name in the CSS file (*fixed-model*)
- now we get all the ones that reached the bottom and get all the blocks of that block and change the class name of all the blocks. 

### Blocks collision, how to limited the blocks activity when it meets other blocks?
- left and right collision and bottom collision
- need a function to determine when the blocks meet each other
- this requires the position of all of the fixed blocks to be recorded in order for us to tell the function to do nothing when we try to move it into an occupied space
- now we have completed the function *isMeet* to determine true or false. But we still have to make sure once it touches another block, rotation will also be stopped. 
#### bottom collision
- we only a function that stops the block an re-generate a new block when it meets another block, not just when the bottom of the container is met
- when does meeting the bottom of the shapes happen? It happens when we are moving the 4x4 box(16 -gird)
- so we have to adjust the *move* function, the detection of the bottom of the shape happens when we are moving it on the y-axis

Now our blocks are rotating, when it meet the bottom border, it can no longer move and when the left or right touches another block, it can no longer rotate. We also adjusted the *move* function so when the moving block touches another block on the bottom, it will stop and re-generate by incorporating the *fixedBottomBlock* function that we already wrote for fixing it to the bottom borderline of teh whole container. 

### The next step is to write a function that will determine if the space/row/col is filled, at the same time, have the above blocks drop down
- we determine this by what is already in the *fixedBlock* 
- every grid in the row also means every col in the row. So if it's occupied, it will return a value, if it's not occupied, it will be undefined. 
 * now we clear the row if it's filled is true 
 * after clearing, we need to move the all of teh above blocks to move down
 - we ar going to cerate another function for that
 - we need to call this function in the *removeLine* function

### Now we finalize the program
- we will need to have the program randomly generate different shape and drop automatically
- we used the method incorporated in HS already: setInterval(), and let it run the *move* function on a set interval of a short amount of time, 600ms. and let it drop on a straight line down the y asix. so one step at a time
### Time to indicate when the game is over
- automatic generation of shapes should be stopped when it reaches the top






# resources: 
======

## Game Logic:

https://www.bilibili.com/video/BV11E411x7jw?p=10&vd_source=d66e6286bcebdd2194e9e66f6d48ff09


## CSS:

https://youtu.be/mW0Z1T8l7sU

https://www.bilibili.com/video/BV1pF411d7PL?vd_source=d66e6286bcebdd2194e9e66f6d48ff09


