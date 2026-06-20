import os
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pinecone import Pinecone, ServerlessSpec
from langchain_pinecone import PineconeVectorStore

# Load environment variables
load_dotenv()

def upload_to_pinecone(file_path, index_name="portfolio-index", namespace="default"):
    # 1. Initialize API Keys
    gemini_api_key = os.getenv("VITE_GEMINI_API_KEY")
    pinecone_api_key = os.getenv("VITE_PINECONE_API_KEY")
    
    if not gemini_api_key or not pinecone_api_key:
        print("Error: API keys not found in .env file.")
        return

    # 2. Load and Split Documents
    print(f"Loading {file_path}...")
    if file_path.endswith('.pdf'):
        loader = PyPDFLoader(file_path)
    else:
        loader = TextLoader(file_path)
        
    documents = loader.load()
    
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    chunks = text_splitter.split_documents(documents)
    print(f"Created {len(chunks)} chunks.")

    # 3. Initialize Embeddings
    embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-2", google_api_key=gemini_api_key)

    # 4. Initialize Pinecone
    pc = Pinecone(api_key=pinecone_api_key)
    
    # Create index if it doesn't exist
    existing_indexes = [idx.name for idx in pc.list_indexes()]
    if index_name not in existing_indexes:
        print(f"Creating index {index_name}...")
        pc.create_index(
            name=index_name,
            dimension=3072, # Dimension for gemini-embedding-2
            metric='cosine',
            spec=ServerlessSpec(cloud='aws', region='us-east-1')
        )
    else:
        # Check if dimension matches
        index_description = pc.describe_index(index_name)
        if index_description.dimension != 3072:
            print(f"Error: Existing index '{index_name}' has dimension {index_description.dimension}, but 'gemini-embedding-2' uses 3072.")
            print("Please delete the index in Pinecone console or use a different index name.")
            return

    # 5. Upload to Pinecone
    print(f"Uploading to namespace '{namespace}'...")
    # Langchain-pinecone looks for PINECONE_API_KEY in the environment
    os.environ["PINECONE_API_KEY"] = pinecone_api_key
    
    vectorstore = PineconeVectorStore.from_documents(
        chunks, 
        embeddings, 
        index_name=index_name, 
        namespace=namespace
    )
    
    print("Upload complete!")

if __name__ == "__main__":
    # Example Usage:
    # 1. Create a data folder and put your resume/docs there
    # 2. Run: python scripts/upload_to_pinecone.py
    
    # Path to your resume in the public folder
    FILE_TO_UPLOAD = "public/resume.pdf"
    NAMESPACE = "sumit-portfolio"
    
    if os.path.exists(FILE_TO_UPLOAD):
        upload_to_pinecone(FILE_TO_UPLOAD, namespace=NAMESPACE)
    else:
        print(f"Please place your file at {FILE_TO_UPLOAD} or update the script path.")
