package casdoor

import (
	"github.com/casdoor/casdoor-go-sdk/auth"
)

func GetUsers() []*auth.User {
	owner := CasdoorOrganization

	if adapter == nil {
		panic("casdoor adapter is nil")
	}

	users := []*auth.User{}
	err := adapter.Engine.Desc("created_time").Find(&users, &auth.User{Owner: owner})
	if err != nil {
		panic(err)
	}

	return users
}

func GetSortedUsers(sorter string, limit int) []*auth.User {
	owner := CasdoorOrganization

	if adapter == nil {
		panic("casdoor adapter is nil")
	}

	users := []*auth.User{}
	err := adapter.Engine.Desc(sorter).Limit(limit, 0).Find(&users, &auth.User{Owner: owner})
	if err != nil {
		panic(err)
	}

	return users
}

func GetUser(name string) *auth.User {
	owner := CasdoorOrganization

	if adapter == nil {
		panic("casdoor adapter is nil")
	}

	if owner == "" || name == "" {
		return nil
	}

	user := auth.User{Owner: owner, Name: name}
	existed, err := adapter.Engine.Get(&user)
	if err != nil {
		panic(err)
	}

	if existed {
		return &user
	} else {
		return nil
	}
}

func QueryUsers(ids []string) map[string]*auth.User {
	owner := CasdoorOrganization
	users := make(map[string]*auth.User)
	for _, id := range ids {
		user := auth.User{Owner: owner, Id: id}
		existed, err := adapter.Engine.Get(&user)
		if err != nil {
			panic(err)
		}

		if existed {
			users[id] = &user
		} else {
			continue
		}
	}
	return users
}

func GetUserById(id string) *auth.User {
	owner := CasdoorOrganization

	if adapter == nil {
		panic("casdoor adapter is nil")
	}

	if owner == "" || id == "" {
		return nil
	}

	user := auth.User{Owner: owner, Id: id}
	existed, err := adapter.Engine.Get(&user)
	if err != nil {
		panic(err)
	}

	if existed {
		return &user
	} else {
		return nil
	}
}

func GetUserByName(name string) *auth.User {
	owner := CasdoorOrganization

	if adapter == nil {
		panic("casdoor adapter is nil")
	}

	if owner == "" || name == "" {
		return nil
	}

	user := auth.User{Owner: owner, Name: name}
	existed, err := adapter.Engine.Get(&user)
	if err != nil {
		panic(err)
	}

	if existed {
		return &user
	} else {
		return nil
	}
}
