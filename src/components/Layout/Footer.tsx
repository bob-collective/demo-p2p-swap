import { Flex, Span } from '@interlay/ui';
import { StyledFooter } from './Layout.styles';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { DOCS_URL, GITHUB_URL } from '../../constants/links';

const Footer = () => {
  return (
    <StyledFooter justifyContent='flex-end'>
      <Flex gap='spacing4'>
        <a href={DOCS_URL} rel='external' target='_blank'>
          <Flex gap='spacing2'>
            <Span>Docs</Span>
            <FaExternalLinkAlt color='white' size='.9em' />
          </Flex>
        </a>
        <a href={GITHUB_URL} rel='external' target='_blank'>
          <Flex gap='spacing2'>
            <Span>GitHub</Span>
            <FaGithub color='white' size='1.25em' />
          </Flex>
        </a>
      </Flex>
    </StyledFooter>
  );
};

export { Footer };
