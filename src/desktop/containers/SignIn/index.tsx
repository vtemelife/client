import React, { useContext, useState } from 'react';
import { useMutate } from 'restful-react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import {
  Button,
  Row,
  Col,
  Card,
  Container,
  Carousel,
  Alert,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';

import { handleErrors } from 'utils';
import { AuthUserContext } from 'generic/containers/ContextProviders/HeaderUserService';
import { SERVER_URLS } from 'routes/server';
import { CLIENT_URLS } from 'desktop/routes/client';
import FormInput from 'generic/components/Form/FormInput';
import FormSlug from 'generic/components/Form/FormSlug';
import FormErrors from 'generic/components/Form/FormErrors';

import { _ } from 'trans';

import image1 from 'generic/layout/images/sign-in/1.jpg';
import image2 from 'generic/layout/images/sign-in/2.jpg';
import image3 from 'generic/layout/images/sign-in/3.jpg';
import image4 from 'generic/layout/images/sign-in/4.jpg';
import image5 from 'generic/layout/images/sign-in/5.jpg';
import image6 from 'generic/layout/images/sign-in/6.jpg';
import image7 from 'generic/layout/images/sign-in/7.jpg';
import image8 from 'generic/layout/images/sign-in/8.jpg';
import FormCheckBoxes from 'generic/components/Form/FormCheckBoxes';
import { SitePolicyModal } from 'generic/containers/SitePolicy';

const SignIn: React.SFC<any> = () => {
  const history = useHistory();
  const userAuth = useContext(AuthUserContext);
  const [formSignInData, changeSignInFormData] = useState({
    username: '',
    password: '',
  } as any);
  const [formSignInErrors, changeSignInFormErrors] = useState({} as any);

  const [formSignUpData, changeSignUpFormData] = useState({} as any);
  const [formSignUpErrors, changeSignUpFormErrors] = useState({} as any);

  const [showPrivacy, changeShowPrivacy] = useState(false);

  const { mutate: signInAction } = useMutate({
    verb: 'POST',
    path: SERVER_URLS.SIGN_IN.buildPath(),
  });

  const { mutate: signUpAction } = useMutate({
    verb: 'POST',
    path: SERVER_URLS.SIGN_UP_STEP_1.buildPath(),
  });

  const images = [
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
    image7,
    image8,
  ];
  return (
    <Container className="signin-container">
      <Helmet>
        <title>{_('Sign In')}</title>
        <meta name="description" content={_('Sign In')} />
      </Helmet>
      <Row>
        {/* {(signInLoading || signUpLoading) && <Loading />} */}
        <Col lg={5}>
          <Card>
            <Card.Body>
              <Alert variant="danger">{_('Age limit 18+')}</Alert>
              <Card.Title>{_('Sign In')}</Card.Title>
              <FormErrors errors={formSignInErrors.non_field_errors} />
              <FormInput
                label={`${_('Email or link to your profile')}*:`}
                type="text"
                name="email_or_slug"
                required={true}
                value={formSignInData.email_or_slug}
                errors={formSignInErrors.email_or_slug}
                onChange={(target: any) =>
                  changeSignInFormData({
                    ...formSignInData,
                    email_or_slug: target.target.value,
                  })
                }
              />
              <FormInput
                label={`${_('Password')}*:`}
                type="password"
                name="password"
                required={true}
                value={formSignInData.password}
                errors={formSignInErrors.password}
                onChange={(target: any) =>
                  changeSignInFormData({
                    ...formSignInData,
                    password: target.target.value,
                  })
                }
              />
              <Button
                onClick={() => {
                  signInAction({
                    email_or_slug: formSignInData.email_or_slug,
                    password: formSignInData.password,
                  })
                    .then((data: any) => {
                      changeSignInFormErrors({});
                      changeSignUpFormErrors({});
                      userAuth.refetchHeaderUser();
                      history.push({
                        pathname: CLIENT_URLS.USER.PROFILE.buildPath({
                          userSlug: data.slug,
                        }),
                      });
                    })
                    .catch((errors: any) => {
                      changeSignUpFormErrors({});
                      handleErrors(errors, changeSignInFormErrors);
                    });
                }}
                variant="primary"
              >
                {_('Sign In')}
              </Button>
              <Link
                to={CLIENT_URLS.AUTH.RESET_PASSWORD.buildPath()}
                className="float-right"
              >
                {_('Forgot your password?')}
              </Link>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <Card.Title>{_('Sign Up')}</Card.Title>
              <FormErrors errors={formSignUpErrors.non_field_errors} />
              <FormInput
                label={`${_('Email')}*:`}
                type="email"
                name="email"
                required={true}
                value={formSignUpData.email}
                errors={formSignUpErrors.slug}
                onChange={(target: any) =>
                  changeSignUpFormData({
                    ...formSignUpData,
                    email: target.target.value,
                  })
                }
              />
              <FormSlug
                label={`${_('Create a link to your profile')}*:`}
                type="text-break"
                name="slug"
                required={true}
                value={formSignUpData.slug}
                errors={formSignUpErrors.slug}
                onChange={(target: any) =>
                  changeSignUpFormData({
                    ...formSignUpData,
                    slug: target.value,
                  })
                }
              />
              <FormInput
                label={`${_('Enter your nickname on the site here')}*:`}
                type="text-break"
                name="name"
                required={true}
                value={formSignUpData.name}
                errors={formSignUpErrors.name}
                onChange={(target: any) =>
                  changeSignUpFormData({
                    ...formSignUpData,
                    name: target.target.value,
                  })
                }
              />
              <FormCheckBoxes
                type="checkbox"
                name="signUpPrivacy"
                className="policy-checkbox"
                checkboxes={[
                  {
                    value: 'privacy',
                    display: (
                      <>
                        {_('I agree with')}{' '}
                        <span
                          className="policy"
                          onClick={(e) => {
                            e.preventDefault();
                            changeShowPrivacy(true);
                          }}
                        >
                          {_('site private policy')}
                        </span>
                      </>
                    ),
                  },
                ]}
                value={formSignUpData.privacy ? ['privacy'] : []}
                errors={formSignUpErrors.privacy}
                onChange={(target: any) =>
                  changeSignUpFormData({
                    ...formSignUpData,
                    privacy: target.target.checked,
                  })
                }
              />
              <Button
                onClick={() => {
                  signUpAction({
                    email: formSignUpData.email,
                    slug: formSignUpData.slug,
                    name: formSignUpData.name,
                    privacy: formSignUpData.privacy,
                  })
                    .then((data: any) => {
                      changeSignInFormErrors({});
                      changeSignUpFormErrors({});
                      userAuth.refetchHeaderUser();
                      history.push({
                        pathname: CLIENT_URLS.AUTH.SIGN_UP_FINISH.buildPath({
                          userPk: data.pk,
                        }),
                      });
                    })
                    .catch((errors: any) => {
                      changeSignInFormErrors({});
                      handleErrors(errors, changeSignUpFormErrors);
                    });
                }}
                variant="primary"
              >
                {_('Continue registration')}
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={7} className="sign-in-carousel">
          <Card>
            <Card.Body>
              <Card.Title>{_('VTeme')}</Card.Title>
              <Card.Text>{_('Adult social network')}</Card.Text>
              <Carousel className="sign-in-carousel">
                {images.map((image, index) => (
                  <Carousel.Item key={index}>
                    <img className="d-block w-100" src={image} alt="" />
                  </Carousel.Item>
                ))}
              </Carousel>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <SitePolicyModal
        show={showPrivacy}
        onHide={() => changeShowPrivacy(false)}
      />
    </Container>
  );
};

export default SignIn;
