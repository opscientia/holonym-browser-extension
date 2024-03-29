# Holonym

---THIS README IS OUTDATED---

This extension store credentials that can be used to generate zk proofs about aspects of one's identity.

Holonym website: https://holonym.id/

## Requirements

- Node ^16.14.2
- Rollup (used for general bundling)
- Browserify (used to handle the use of `process` in metamask extension package)

## Storage scheme

This extension handles storage of credentials. It assumes credentials are encrypted before they are passed to it.

### Storage procedure

This extension takes the following steps to store credentials:

1.  Listens for a 'message' event of the following form:

        {
            message: "setHoloCredentials",
            credentials: {
                unencryptedCreds: {
                    firstName: "John"
                    ...
                    serverSignature: "0xabc..."
                },
                encryptedCreds: "0x123..."
            }
        }

2.  Upon receiving a "setHoloCredentials" message, it does the following:
    1.  Check the shape of the provided object to ensure the exptected keys are present.
    2.  Ask the user if they want to store the credentials.
    3.  If user confirms that they want to store the credentials, the extension stores `credentials.encryptedCreds` in chrome storage.

### Suggested encryption procedure

It is highly recommended that credentials are encrypted before being stored. It is the sole responsibility of the user to ensure their credentials are encrypted prior to being stored.

The recommended encryption procedure is the following.

1.  Given a credential object that accords with the [credential object schema](#credential-object-schema), convert it to a string with the `JSON.stringify` function.

        const credsStr = JSON.stringify(credentials);

2.  Then encrypt the resultant string.

### Credential object schema

        {
            birthdate: "",
            city: "",
            completedAt: "",
            countryCode: "",
            firstName: "",
            lastName: "",
            middleInitial: "",
            postalCode: "",
            secret: "",
            serverSignature: "",
            streetAddr1: "",
            streetAddr2: "",
            subdivision: "",
        }
