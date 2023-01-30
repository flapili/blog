---
title: Unleash the power of error in Go
description: If you are a Go developer, you must have encountered errors in Go but do you know how powerful they are ? In this article, we will discuss the error handling in Go and how to use it in your code.
author:
  name: joffref
  avatar: joffref.webp
archived: false
tags:
  - Go
  - Error
  - Error Handling
createdAt: "2023-01-15T19:04:40Z"
---

[[toc]]

If you are a Go developer, you must have encountered errors in Go but do you know how powerful they are ? In this article, we will discuss the error handling in Go and how to use it in your code.

## What is an error in Go ?

An error is a type that implements the error interface. The error interface is defined as follows:

```go
// The error built-in interface type is the conventional interface for
// representing an error condition, with the nil value representing no error.
type error interface {
    Error() string
}
```

The error interface is very simple, it has only one method, Error(). This method returns a string. The string returned by the error interface is the error message.

## How to handle errors in Go ?

There are many ways to handle errors in Go. The most common way is to use the if statement. Let’s take an example:

```go
package main

import (
    "fmt"
    "os"
)

func main() {
    f, err := os.Open("test.txt")
    if err != nil {
        fmt.Println(err)
        return
    }
    fmt.Println(f.Name(), "opened successfully")
}
```

In this example, we open a file. If an error occurs, we print the error and return. If no error occurs, we print the name of the file.
The problem is that we don’t know what kind of error occurred. We only know that an error occurred. Maybe this error is not important and we can continue our program. Maybe this error is important and we need to stop our program. We don’t know.
Moreover, when reading the code, it is not clear on which error can occur. We have to read the documentation of the os.Open function to know what kind of errors can occur.

## How to handle errors in Go — Implementations of the error interface

Most of the packages in Go have their own error interface implementation. For example, the os package has the os.PathError type. This type is used to represent errors that can occur when opening a file. The os.PathError type is defined as follows:

```go
// PathError records an error and the operation and file path that caused it.
type PathError struct {
	Op   string
	Path string
	Err  error
}
```

The os.PathError type has three fields:

  * Op: the operation that failed
  * Path: the path of the file
  * Err: the error that occurred

All those fields are exported, so we can access them and use them in our code. Let’s take an example:

```go
package main

import (
    "fmt"
    "os"
)

func main() {
    f, err := os.Open("test.txt")
    if err != nil {
        if pathErr, ok := err.(*os.PathError); ok {
            fmt.Println("Path error:", pathErr.Path)
            fmt.Println("Error:", pathErr.Err)
            return
        }
        fmt.Println(err)
        return
    }
    fmt.Println(f.Name(), "opened successfully")
}
```

In this example, we check if the error is a PathError. If it is, we print the path and the error. If it is not, we print the error.
This is a very simple example, but it shows how to use the already builtin errors in Go. We can use those types to handle errors properly.

## How to handle errors in Go — Custom error type

Maybe you want to create your own error. You can do it by implementing the error interface. Let’s take an example:

```go
package main

import (
    "fmt"
)

type MyError struct {
    msg string
}

func (e *MyError) Error() string {
    return e.msg
}
```

In this example, we create a MyError type that implements the error interface. The MyError type has one field, msg, that is a string. The Error() method returns the msg field.
Moreover, we can create a new error by using the errors.New function. Let’s take an example:

```go
package main

import (
    "errors"
    "fmt"
)

var (
   myError = errors.New("Empty string")
)

func doSomething(msg string) error {
       if msg == "" {
        return myError
    }
    return nil
}

func main() {
   err := doSomething("")
    if err != nil {
        fmt.Println(err)
        return
    }
    fmt.Println("No error")
}
```

Normally this snippet will throw our new error.
Now we can use this error in our code. We can check if the error is our error and handle it properly.

```go
package main

import (
    "errors"
    "fmt"
)

var (
    myError = errors.New("Empty string")
)

func doSomething(msg string) error {
    if msg == "" {
        return myError
    }
    return nil
}

func main() {
    err := doSomething("")
    if err != nil {
        if err == myError {
            // handle the error

        } else {
            fmt.Println(err)
            return
        }
    }
    fmt.Println("No error")
}
```

## How to handle errors in Go — Wrap errors

Sometimes, we want to wrap an error. We can do it by using the errors.Wrap function provided by github.com. Let’s take an example:

```go
package main

import (
    "fmt"
    "os"

    "github.com/pkg/errors"
)

func main() {
    f, err := os.Open("test.txt")
    if err != nil {
        fmt.Println(errors.Wrap(err, "Error opening file"))
        return
    }
    fmt.Println(f.Name(), "opened successfully")
}
```

Plus, wrapping an error will keep the stack trace. This is very useful when debugging.
If you don’t want to use the github.com/pkg/errors package, you can use the fmt.Errorf function. Let’s take an example:

```go
package main

import (
    "fmt"
    "os"
)

func main() {
    f, err := os.Open("test.txt")
    if err != nil {
        fmt.Println(fmt.Errorf("Error opening file: %w", err))
        return
    }
    fmt.Println(f.Name(), "opened successfully")
}
```

The fmt.Errorf function is very similar to the errors.Wrap function. The only difference is that the fmt.Errorf function doesn’t keep the stack trace.

## Conclusion

In this article, we saw how to handle errors in Go. We saw how to use the already builtin errors in Go. We saw how to create our own error. We saw how to wrap an error. We saw how to use the errors.Wrap function. We saw how to use the fmt.Errorf function.
I hope you enjoyed this article. If you have any questions, feel free to ask them in the comments. If you want to learn more about Go, you can check out my other articles.

