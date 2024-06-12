FROM cypress/browsers:latest

WORKDIR /tests

COPY package.json yarn.lock ./
RUN yarn

COPY ./ ./

ENTRYPOINT [ "yarn" ]
CMD ["test:ci:qa"]
