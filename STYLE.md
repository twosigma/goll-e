# Javascript Coding Style Guide

This guide provides some rules for Javascript style in this repository. They give a "correct" way of writing Javascript syntax in this codebase. These rules strive for quality, maintainability, and consistency. Some may seem arbitrary, and there may be equally effective alternatives. However, consistency will make it easier to collaborate together on files and read others' code without learning the personal styles of the author. 


## Indentation
Use two spaces for each level of indentation. Do not use the tab character.

## Declarations

### Always use `var`
Always use `var` to declare a variable. Omitting it creates a global, which is bad. 

Javascript also lets you do multiple assignments in one statement. For clarity: don't.

**Bad**
```
var a = 5,
b = 3,
c = 1;
```

**Good**
```
var a = 5;
var b = 3;
var c = 1;
```

### Variable naming
`localVarName, ClassName, ClassName.staticProperty, CONSTANT_AND_IMMUTABLE`


## Semicolons
Always use them. Though your code may run, it can also cause hard-to-debug problems. This includes after function expressions (but not declarations). 

## Delete trailing whitespace
Your IDE may do this for you.

## Beware of trailing commas
This is a trailing comma:

```
var myObj = {
  a: 5,
  b: 6,
  c: 7,
}
```
So easy to do by accident; and then IE dies.

## String literals

### Quote marks
Always use `'single'` quotes on string literals. 

### Multi-line literals

**Bad**
```
var longString = 'This in quite a long string I\'m running out of columns\ 
so I\'ll continue here.';
```

**Good**
```
var longString = 'This in quite a long string I\'m running out of columns ' +
'so I\'ll continue here.';
```

## Booleans & falsy/truthy
Booleans in Javascript are a nightmare. 
Beware of "falsy" and "thruthy" values where a boolean is expected. Beware of falsy values where an explicit `null` is expected. If you are expecting `null` or a valid value, but never `undefined`, be sure to check explicitly for `null`. Be sure not to reject valid falsy values such as the empty string or 0.

### Always use double-equals
*Always* use the `===` and `!==` operators instead of `==` and `!=` unless you know what you're doing (you're expecting truthy/falsy values).

## Callbacks
Promises are preferred over callbacks where appropriate.


## Blocks

### Brackets on blocks
*Always* use brackets on conditional and loop blocks, even when they are one line.

**Bad**
```
if (condition)
  doSomething();
```

**Good**
```
if (condition) {
  doSomething();
}
```

## Ternaries
They're cool. Just don't nest them. It makes you feel smart, but no one else can read it.

Instead of this
```
if (val) {
  return foo();
} else {
  return bar();
}
```

You can write
``` 
return val ? foo() : bar(); 
```

## Spacing

## Line breaks
Make your code look pretty. Add extra line breaks logically. Always add line breaks after method declarations and after blocks. Before submitting your code for review, tidy it up with some spacing. 

## Spaces
Always use spaces around operators. E.g.
`var a = 5;` instead of `var a=5;`

## Function length
After about 50 lines, it may be time to break up a function. That may seem short, but try it. It will probably be more readable. 

# Automatic style checking
It is highly recommended to use JSLint with your favorite editor. It will warn you about most of the rules in this guide when used with the following settings.
```
{
  "regexdash": true,
  "browser": true,
  "wsh": true,
  "trailing": true,

  "curly": true,
  "indent": 2,
  "latedef": true,
  "quotmark": "single",
  "yui": true,
  "es3": true,
  "gcl": true,
  "maxcomplexity": 6
}
```

# Javascript Documentation
Use JSDoc syntax. http://usejsdoc.org/

Code should be self-documenting, but clarifying comments are often helpful.

# LESS Coding Style Guide

## File Scope
All files should be wrapped in a scope relevant to the component they style. For example, if this is the less file for `MyGreatWidget`:
```
// TOP OF FILE
.my-great-widget {
  // content
}
// END OF FILE
```


## Variable Scope
Scope variables as narrowly as possible. *Never* put variables in the global scope. Following the file scope rule above will prevent this.

## Spacing
Add a line break after every block.

## Nesting
Nesting blocks is encouraged when it reflects how components are nested in the DOM.
Nesting can be achieved like so:
```
#header {
  color: black;
  .navigation {
    font-size: 12px;
  }

  .logo {
    width: 300px;

    &:hover {
      cursor: pointer;
    }
  }
}
```

## Mixins as utility functions

When defining a mixin function that is not intended to style anything directly without explicitly being called, use empty parenthesis.
```
.my-mixin() {
  // stuff
}
```
This compiles to empty. Without parenthesis, it would compile as written to CSS.

## Advanced features
Guards, loops, merging, and extending are very new to LESS. They should be used only with a good understanding of their function.


# Conclusion
Strive for *consistency*. Write self-documenting, maintainable code. Give it some air with spacing. Don't use syntax that has iffy meanings—be explicit. Follow standards. Don't be dumb. 
The end.

