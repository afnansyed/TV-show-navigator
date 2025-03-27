package encryption

import (
	"golang.org/x/crypto/bcrypt"
)

//functions stolen from: https://medium.com/@rnp0728/secure-password-hashing-in-go-a-comprehensive-guide-5500e19e7c1f

// encrypts password (max length of 72 bytes)
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

// verifies if the given password matches the stored hash.
func VerifyPassword(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
