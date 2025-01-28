import {Field, InputType, Int} from "@nestjs/graphql";
import {ContextualGraphqlRequest} from "../../../index";

@InputType()
export default class FileDto {

    @Field()
    filename: string;

    @Field()
    initialFilename: string;

    @Field()
    path: string;

    @Field()
    uri: string;

    context?: ContextualGraphqlRequest;
}
