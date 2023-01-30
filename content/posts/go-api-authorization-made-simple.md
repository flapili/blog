---
title: Go API authorization made simple
description: Most of the time, you want to authorize your users before they can access your API. This is a very common task and it is very easy to do with Go. In this article, we will see how to do it.
author:
  name: joffref
  avatar: joffref.webp
archived: false
tags:
  - Go
  - API
  - Authorization
createdAt: "2023-01-15T19:04:40Z"
---

[[toc]]

Most of the time, you want to authorize your users before they can access your API. This is a very common task and it is very easy to do with Go. In this article, we will see how to do it.

## The problem

Let’s say you have an API that you want to protect. You want to make sure that only authenticated users can access it. You also want to make sure that the user has the right permissions to access the API.

For example, grant access to premium contents only to premium users.

## The solution

To solve this problem, we must introduce two concepts: authentication and authorization. Authentication is the process of verifying that a user is who they say they are. Authorization is the process of verifying that a user has the right permissions to access a resource.

In this article, we will see how to do only the authorization part. We will see how to verify that a user has the right permissions to access a resource.

Before we start, let’s introduce a few tools that we will use in this article.

## Tools

### Open Policy Agent

In this tutorial, we will use Open Policy Agent (OPA) to solve this problem. OPA is an open source project that provides a policy engine. It can be used to enforce policies in your application. It can be used to authorize your users, validate your data, and much more.

<img src="https://miro.medium.com/max/640/0*WRXobwrvF8QCiE6e.webp">

I know that you can directly do this inside your app, but the maintainability of your software could be impacted. Imagine, you create a new role inside your organization, you will have to modify your code in order to handle this addition. By using OPA, policies are global to the organization and changes does not force you to modify your code.

### Opa-middleware library

We will use the <a href="https://github.com/Joffref/opa-middleware">opa-middleware library</a> to integrate OPA with our Go application. This library provides a middleware that you can use to authorize your users. It is very easy to use and it is very flexible.

## Example

Let’s assume, your API has two users. Alice who is an article consumer (read access) and Bob who is a publisher (write access)

We assume that you want to protect the following CRUD endpoint:

```go
type Handler struct {
}

func (h *Handler) GetArticle(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Get article"))
}

func (h *Handler) CreateArticle(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Create article"))
}

func (h *Handler) UpdateArticle(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Update article"))
}

func (h *Handler) DeleteArticle(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Delete article"))
}

func (h *Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		h.GetArticle(w, r)
	case http.MethodPost:
		h.CreateArticle(w, r)
	case http.MethodPut:
		h.UpdateArticle(w, r)
	case http.MethodDelete:
		h.DeleteArticle(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}
```

### The OPA policy

The OPA policy is a JSON document that defines the permissions of your users. It is very easy to write. You can write it in a few minutes.

In this example, we will use the following data:

```json
{
  "users": {
    "alice": {
      "permissions": [
        "articles:read"
      ]
    },
    "bob": {
      "permissions": [
        "articles:read",
        "articles:write"
      ]
    }
  }
}
```

This data defines two users: `alice` and `bob`. `alice` has the `articles:read` permission. `bob` has the `articles:read` and `articles:write` permissions.

The following policy will be used in this example to authorize the users:

```go
package policy

default allow = false

allow {
    input.method = "GET"
    input.path = ["articles"]
    has_permission("articles:read")
}

allow {
    input.method = "POST"
    input.path = ["articles"]
    has_permission("articles:write")
}

allow {
    input.method = "PUT"
    input.path = ["articles"]
    has_permission("articles:write")
}

allow {
    input.method = "DELETE"
    input.path = ["articles"]
    has_permission("articles:write")
}

has_permission(permission) {
    user := input.user
    permissions := document.users[user].permissions
    permissions[_] = permission
}
```

### The Go application

Now that we have the OPA policy, we can write our Go application. We will use the <a href="https://github.com/Joffref/opa-middleware">opa-middleware library</a> to integrate OPA with our application.

#### Embedded

```go
package main

import (
	opamiddleware "github.com/Joffref/opa-middleware"
	"github.com/Joffref/opa-middleware/config"
	"net/http"
	"strings"
)

var policy = `
package policy
default allow = false
document := {
    "users": {
        "alice": {
            "permissions": [
                "articles:read"
            ]
        },
        "bob": {
            "permissions": [
                "articles:read",
                "articles:write"
            ]
        }
    }
}
allow {
    input.method = "GET"
    input.path = ["articles"]
    has_permission("articles:read")
}
allow {
    input.method = "POST"
    input.path = ["articles"]
    has_permission("articles:write")
}
allow {
    input.method = "PUT"
    input.path = ["articles"]
    has_permission("articles:write")
}
allow {
    input.method = "DELETE"
    input.path = ["articles"]
    has_permission("articles:write")
}
has_permission(permission) {
    user := input.user
    permissions := document.users[user].permissions
    permissions[_] = permission
}
`

type Handler struct {
}

func (h *Handler) GetArticle(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Get article"))
}

func (h *Handler) CreateArticle(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Create article"))
}

func (h *Handler) UpdateArticle(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Update article"))
}

func (h *Handler) DeleteArticle(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Delete article"))
}

func (h *Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		h.GetArticle(w, r)
	case http.MethodPost:
		h.CreateArticle(w, r)
	case http.MethodPut:
		h.UpdateArticle(w, r)
	case http.MethodDelete:
		h.DeleteArticle(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func main() {
	handler, err := opamiddleware.NewHTTPMiddleware(
		&config.Config{
			Policy: policy,
			Query:  "data.policy.allow",
			InputCreationMethod: func(r *http.Request) (map[string]interface{}, error) {
				return map[string]interface{}{
					"path":   strings.Split(r.URL.Path, "/")[1:],
					"method": r.Method,
					"user":   r.Header.Get("X-User"),
				}, nil
			},
			ExceptedResult:   true,
			DeniedStatusCode: http.StatusForbidden,
			DeniedMessage:    "Forbidden",
		},
		&Handler{},
	)
	if err != nil {
		panic(err)
	}
	http.HandleFunc("/articles", handler.ServeHTTP)
	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		return
	}
}
```

#### Remote

```go
package main

import (
	opamiddleware "github.com/Joffref/opa-middleware"
	"github.com/Joffref/opa-middleware/config"
	"net/http"
	"strings"
)


type Handler struct {
}

func (h *Handler) GetArticle(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Get article"))
}

func (h *Handler) CreateArticle(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Create article"))
}

func (h *Handler) UpdateArticle(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Update article"))
}

func (h *Handler) DeleteArticle(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Delete article"))
}

func (h *Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		h.GetArticle(w, r)
	case http.MethodPost:
		h.CreateArticle(w, r)
	case http.MethodPut:
		h.UpdateArticle(w, r)
	case http.MethodDelete:
		h.DeleteArticle(w, r)
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func main() {
	handler, err := opamiddleware.NewHTTPMiddleware(
		&config.Config{
			URL: "http://localhost:8181/",
			Query:  "data.policy.allow",
			InputCreationMethod: func(r *http.Request) (map[string]interface{}, error) {
				return map[string]interface{}{
					"path":   strings.Split(r.URL.Path, "/")[1:],
					"method": r.Method,
					"user":   r.Header.Get("X-User"),
				}, nil
			},
			ExceptedResult:   true,
			DeniedStatusCode: http.StatusForbidden,
			DeniedMessage:    "Forbidden",
		},
		&Handler{},
	)
	if err != nil {
		panic(err)
	}
	http.HandleFunc("/articles", handler.ServeHTTP)
	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		return
	}
}
```

### Let's test it

First, try to get articles with Alice account.

<img src="https://miro.medium.com/max/640/1*NgezHjtHKixSyrV_KuMKuA.webp">

It works indeed in OPA Alice is authorized to read articles. Now, let’s see if Alice can create an article.

<img src="https://miro.medium.com/max/640/1*FZ9pnYXSrrVOcxcMw50iCg.webp">

As shown, Alice can’t create an article, as it’s explicitly written in rules. Let’s see with Bob.

<img src="https://miro.medium.com/max/640/1*u6FOo1AK8Z7UtSySoVuIJA.webp">

Bob can create an article. Authorizations are well enforced in the articles endpoint of our API.

Thanks for reading !!
