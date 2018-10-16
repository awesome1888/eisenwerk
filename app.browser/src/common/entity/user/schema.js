

const schema = new Schema({
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
    profile: {
        type: new Schema({
            firstName: {
                type: String,
            },
            lastName: {
                type: String,
            },
            email: {
                type: String,
                unique: true,
                required: true,
            },
            password: {
                type: String,
            },
            gender: {
                type: String,
            },
            dateOfBirth: {
                type: Date,
            },
            language: {
                type: String,
            },
            phoneNumber: {
                type: String,
            },
            residence: {
                type: String,
            },
            uploadedFileUrl: {
                type: String,
            },
        }, { _id: false }),
        required: true,
    },
    service: {
        type: {
            google: {
                type: Object,
            },
        },
    },
    role: {
        type: [String],
    },
    data: {
        // here goes user-specific data, depending on the roles they have
        // EMPLOYER
        companyId: {
            type: TObjectId,
            ref: 'companies',
        },
        // CANDIDATE
        careerPreference: {
            type: new Schema({
                type: {
                    type: [String],
                },
                permanent: {
                    type: new Schema({
                        searchStatus: {
                            type: String,
                        },
                        noticePeriod: {
                            type: String,
                        },
                        targetSalary: {
                            type: String,
                        },
                        workRemote: {
                            type: String,
                        },
                        preferredRole: {
                            type: [String],
                        },
                        preferredCompany: {
                            type: [String],
                        },
                        preferredLocation: {
                            type: [String],
                        },
                        otherLocation: {
                            type: [String],
                        },
                    }, { _id: false }),
                },
                freelancer: {
                    type: new Schema({
                        targetRate: {
                            type: String,
                        },
                        workRemote: {
                            type: String,
                        },
                        preferredRole: {
                            type: [String],
                        },
                        preferredCompany: {
                            type: [String],
                        },
                        preferredLocation: {
                            type: [String],
                        },
                        otherLocation: {
                            type: [String],
                        },
                    }, { _id: false }),
                }
            }, { _id: false })
        },
        expertise: {
            type: new Schema({
                overall: {
                    type: String,
                },
                type: {
                    type: [String],
                },
                specialities: {
                    type: [new Schema({
                        key: {
                            type: String,
                        },
                        experience: {
                            type: String,
                        },
                    })]
                },
                nrReporting: {
                    type: String,
                },
            }, { _id: false })
        },
        workExperience: {
            type: [new Schema({
                companyName: {
                    type: String,
                },
                occupation: {
                    type: String,
                },
                start: {
                    type: Date,
                },
                end: {
                    type: Date,
                },
                current: {
                    type: Boolean,
                },
                description: {
                    type: String,
                },
            })],
        },
        education: {
            type: [new Schema({
                universityName: {
                    type: String,
                },
                courseName: {
                    type: String,
                },
                start: {
                    type: String,
                },
                end: {
                    type: String,
                },
            })],
        },
        document: {
            type: [new Schema({
                type: {
                    type: String,
                },
                name: {
                    type: String,
                },
                createdAt: {
                    type: Date,
                },
                url: {
                    type: String,
                },
            })],
        },
        skills: {
            type: [new Schema({
                skill: {
                    type: String,
                },
                level: {
                    type: String,
                },
            })],
        },
        language: {
            type: [new Schema({
                language: {
                    type: String,
                },
                level: {
                    type: String,
                },
            })],
        },
    },
    // feathers-authentication-management uses the following fields for password reset
    resetToken: {
        type: String,
    },
    verifyShortToken: {
        type: String,
    },
    resetExpires: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
    },
    verifyChanges: {
        type: Object,
    },
    verifyToken: {
        type: Object,
    },
});

schema.pre('save', function onSave(next) {

    if (this.isNew) {
        this.data = this.data || {};
    }

    if (this.isNew && !_.isEmpty(this.data)) {
        if (this.data.workExperience && this.data.workExperience.length === 0) {
            this.data.workExperience = undefined;
        }
        if (this.data.education && this.data.education.length === 0) {
            this.data.education = undefined;
        }
        if (this.data.document && this.data.document.length === 0) {
            this.data.document = undefined;
        }
        if (this.data.skills && this.data.skills.length === 0) {
            this.data.skills = undefined;
        }
        if (this.data.language && this.data.language.length === 0) {
            this.data.language = undefined;
        }
    }
    next();
});

export default schema;
