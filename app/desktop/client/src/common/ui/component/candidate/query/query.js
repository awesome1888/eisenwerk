import Candidate from '../../../../entity/user/entity/client.js';

export default Candidate.query((parameters, query) => {
    query.filter({
        role: {$in: ['C']},
        _id: parameters.id || ''
    });

    query.select({
        emails: 1,
        profile: {
            firstName: 1,
            lastName: 1,
            fullName: 1,
            phoneNumber: 1,
            gender: 1,
            uploadedFileUrl: 1,
            dateOfBirth: 1,
            residence: 1,
        },
        data: {
            personalInformation: {
                dateOfBirth: 1,
                residence: 1,
            },
            skills: 1,
            education: 1,
            expertise: {
                overall: 1,
                specialities: 1,
                nrReporting: 1
            },
            workExperience: 1,
            document: 1,
            language: 1,
            careerPreference: 1
        },
        createdAt: 1,
        updatedAt: 1,
    });
});
