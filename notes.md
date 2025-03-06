# CS 260 Notes

[My startup](https://simon.cs260.click)

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

## AWS Notes

### IP Address of PROJECTW
54.163.204.219\
projectw.click

## HTML Notes

[HTML Structure](https://codepen.io/wd19/pen/PwYdvee)\
[HTML Input](https://codepen.io/wd19/pen/JoPaqab?editors=1000)\
[HTML Media](https://codepen.io/wd19/pen/qEWMGgm)\
[Good HTML Reference Guide](https://www.w3schools.com/tags/ref_byfunc.asp)

So far I am planning on using 4 HTML pages. One for the login, one to view scores, one to modify game settings, and one for the hangman game. The scores and login pages will be view seperately by players. While the game settings and the game itself will be view by two players at a time. When the word-giver is inputting the word to guess the guesser shouldn't be able to see it.

## CSS Notes

[CSS Example](https://codepen.io/wd19/pen/ByBqbQv)\
[Practice](https://codepen.io/wd19/pen/zxOeqMe)\
[Bootstrap Example](https://codepen.io/wd19/pen/wBwNGNq?editors=1100)

An element can be moved and rotated with `transform: translate(100px, -20px) rotate(-15deg);`.\
You can edit placeholder settings with `input::placeholder`. Probably used for other things too.\
Be careful about using % based sizes, they don't always work how you think.\
`animation-timing-function: linear;` can be used to change how an animation works.\
`animation-iteration-count: infinite;` for a repeating animation.\
`!important` to override existing rules.\
`element > *` targets all direct children of the element.

## REACT Notes

[First Example](https://codepen.io/wd19/pen/RNbzdqb?editors=0110)\
[Routing](https://codepen.io/wd19/pen/XJrLGQB?editors=0110)

```ruby
npm create vite@latest demoVite -- --template react
cd demoVite
npm install
npm run dev
npm run build
```
Give elements unique class names or ids or all your css will apply to all elements across multple pages.\
When using this component injection style of structuring, avoid adding css styling to the html and body elements.\
REACT wants every html tag to close, including <image>, <a>, and <input>.\
REACT doesn't like the "for" attribute or "checked" attribute that some Bootstrap stuff has.\
Use `to=''` and `path='/' exact` to make a route the default route.\
useEffect can be used to update something one time at the start.\
localStorage is great for data for the user.\
event.target.value to get the value of an input field or text box.\
`variable ? if_true : if_false` is a very simple if else statement.\
`.substring()` gets a portion of a string. It is very useful.\
`.indexOf()` to find something in a string.\
`.includes()` to find something in an array.\
In the future, avoid cramming all your React variables into one variable with a bunch of children. Doesn't work very well.\
Don't make something a React variable if it doesn't need to be.\
`/^[a-zA-Z]+$/.test(word)` checks if a word has only letters in it.\
`autoComplete` and `autoFocus` are very useful attributes to know about.\
`onKeyDown={e => {if (e.key=="Enter") {do_something()}` is a great way to check if the user entered something.\
Don't forget to `import { useNavigate } from 'react-router-dom';` and `const navigate = useNavigate();` if you want to navigate.

## Basic GIT Commands
```ruby
git status #Shows changes
git add #Stages a file
git commit #Commits staged changes
git diff #Shows differences between commits
git push; git pull #Pushes/pulls to/from github
```
## Basic Terminal Commands
```ruby
echo #Output the parameters of the command
cd #Change directory
cd .. #Back to parent directory
mkdir #Make directory
rmdir #Remove directory
rm #Remove file(s)
mv #Move file(s)
cp #Copy files
ls #List files
curl #Command line client URL browser
grep #Regular expression search
find #Find files
top #View running processes with CPU and memory usage
df #View disk statistics
cat #Output the contents of a file
less #Interactively output the contents of a file
wc #Count the words in a file
ps #View the currently running processes
kill #Kill a currently running process
sudo #Execute a command as a super user (admin)
ssh #Create a secure shell on a remote computer
scp #Securely copy files to a remote computer
history #Show the history of commands
ping #Check if a website is up
tracert #Trace the connections to a website
dig #Show the DNS information for a domain
man #Look up a command in the manual
```

## Basic VIM Commands
```ruby
:h	#help
i	#enter insert mode. This will allow you to type and delete text. Use ESC to exit insert mode. No other commands will work while in insert mode.
u	#undo
CTRL-r	#redo
gg	#go to beginning of file
G	#go to end of file
'/'	#search for text that you type after /
n	#next search match
N	#previous search match
v	#visually select text
y	#yank or copy selected text to clipboard
p	#paste clipboard
CTRL-wv	#Split window vertically
CTRL-ww	#Toggle windows
CTRL-wq	#Close current window
:e	#Open a file. Type ahead available. If you open a directory you can navigate it in the window
:w	#write file (save)
:q	#quit. Use :q! to exit without saving
```



