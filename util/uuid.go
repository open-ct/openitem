package util

import "github.com/google/uuid"

func GenUuidV4() string {
	res := uuid.New()
	return res.String()
}
